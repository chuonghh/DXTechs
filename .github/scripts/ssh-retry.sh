# shellcheck shell=bash
# Thử lại scp/ssh khi lỗi xảy ra ở TẦNG KẾT NỐI — dùng trong các bước deploy của GitHub Actions.
#
# Vì sao cần: VPS mở SSH ra Internet nên luôn có bot quét. Khi có nhiều kết nối chưa xác thực cùng lúc,
# sshd (MaxStartups, mặc định 10:30:100) ngắt ngẫu nhiên kết nối mới ⇒ runner nhận
# "kex_exchange_identification: Connection reset by peer" dù key, secrets, firewall đều đúng.
# Lỗi thoáng qua — thử lại sau vài giây là được (sự cố 20/11/2026, run client #6).
#
# Quy tắc AN TOÀN — chỉ thử lại khi chắc chắn chưa có gì chạy trên VPS:
#   - exit code = 255 (scp/ssh báo lỗi kết nối/xác thực; lệnh từ xa thất bại trả mã của chính nó), VÀ
#   - output KHÔNG chứa dòng đánh dấu "[remote] started" (script từ xa in dòng này đầu tiên).
#   Lỗi trong script deploy (migration, compose, kiểm tra health...) KHÔNG được thử lại.
#
# Cách dùng (sau khi `source .github/scripts/ssh-retry.sh`):
#   ssh_retry scp -P "$VPS_PORT" ... file "$VPS_USER@$VPS_HOST:/tmp/file"
#   ssh_retry --stdin remote.sh ssh -p "$VPS_PORT" ... "$VPS_USER@$VPS_HOST" 'bash -s'
# Biến tuỳ chỉnh: SSH_RETRY_ATTEMPTS (mặc định 4), SSH_RETRY_DELAYS (mặc định "5 15 30" giây).

SSH_RETRY_MARKER='[remote] started'

# Lỗi exit 255 nhưng KHÔNG tự hết: sai key, sai known_hosts, sai user, thiếu subsystem sftp...
SSH_RETRY_PERMANENT_ERRORS='Permission denied|Host key verification failed|REMOTE HOST IDENTIFICATION HAS CHANGED|No such file or directory|subsystem request failed|Could not resolve hostname|Bad configuration option|Load key .*: (invalid format|error in libcrypto)'

ssh_retry() {
  local stdin_file=/dev/null
  if [ "${1:-}" = "--stdin" ]; then
    stdin_file="$2"
    shift 2
  fi

  local max_attempts="${SSH_RETRY_ATTEMPTS:-4}"
  local -a delays
  read -r -a delays <<< "${SSH_RETRY_DELAYS:-5 15 30}"

  local attempt=1 rc log rc_file delay
  log="$(mktemp)"
  rc_file="$(mktemp)"

  while :; do
    # Chạy lệnh, vừa in log ra GitHub Actions vừa lưu để tìm dòng đánh dấu.
    # "&& … || …" để `set -e` của shell gọi không dừng giữa chừng; mã thoát ghi ra file
    # (PIPESTATUS không dùng được vì lệnh chạy trong subshell của pipeline).
    { "$@" < "$stdin_file" 2>&1 && echo 0 > "$rc_file" || echo $? > "$rc_file"; } | tee "$log"
    rc="$(cat "$rc_file")"

    if [ "$rc" -eq 0 ]; then
      rm -f "$log" "$rc_file"
      return 0
    fi

    if [ "$rc" -ne 255 ] || grep -qF "$SSH_RETRY_MARKER" "$log"; then
      # Lỗi của script deploy, hoặc script đã bắt đầu chạy trên VPS: không thử lại.
      rm -f "$log" "$rc_file"
      return "$rc"
    fi

    if grep -qE "$SSH_RETRY_PERMANENT_ERRORS" "$log"; then
      # Sai key / known_hosts / cấu hình: thử lại chỉ tốn thời gian — báo lỗi ngay.
      echo "::error::Lỗi SSH không tự hết (key, known_hosts hoặc cấu hình) — không thử lại. Kiểm tra secrets VPS_SSH_KEY / VPS_KNOWN_HOSTS / VPS_USER."
      rm -f "$log" "$rc_file"
      return "$rc"
    fi

    if [ "$attempt" -ge "$max_attempts" ]; then
      echo "::error::SSH/SCP vẫn lỗi kết nối (exit 255) sau $attempt lần thử. Kiểm tra sshd trên VPS: journalctl -u ssh"
      rm -f "$log" "$rc_file"
      return "$rc"
    fi

    delay="${delays[$((attempt - 1))]:-${delays[-1]}}"
    echo "::warning::Lỗi kết nối SSH (exit 255) ở lần $attempt/$max_attempts — thử lại sau ${delay}s"
    sleep "$delay"
    attempt=$((attempt + 1))
  done
}
