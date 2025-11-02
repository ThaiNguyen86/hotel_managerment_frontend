#!/bin/sh

# Tạo file env-config.js trong thư mục build để React đọc biến môi trường runtime
cat <<EOF > /app/build/env-config.js
window._env_ = {
  REACT_APP_BASE_URL: "${REACT_APP_BASE_URL}"
};
EOF

# Serve React build folder trên port 5000
exec serve -s build -l 5000
