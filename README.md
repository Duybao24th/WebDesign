# Long An Decor - Hệ thống quản lý cửa hàng

Ứng dụng quản lý cửa hàng nội thất Long An Decor với giao diện hiện đại, tối ưu cho cả máy tính và thiết bị di động.

## Tính năng chính
- **Dashboard**: Thống kê sản phẩm, đơn hàng và doanh thu.
- **Quản lý kho (Admin)**: Thêm, sửa, xóa sản phẩm (hỗ trợ tải ảnh từ máy hoặc dùng URL).
- **Cửa hàng (User)**: Xem sản phẩm, lọc theo danh mục, tìm kiếm và thêm vào giỏ hàng.
- **Giỏ hàng**: Quản lý sản phẩm đã chọn và đặt hàng.
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng (Chưa thanh toán, Đã thanh toán, Đã hủy).
- **Hệ thống tài khoản**: Phân quyền Admin và Người dùng.

## Công nghệ sử dụng
- **HTML5 / CSS3**: Cấu trúc và giao diện.
- **Tailwind CSS**: Framework CSS tiện lợi.
- **JavaScript (ES6+)**: Xử lý logic và dữ liệu.
- **Lucide Icons**: Biểu tượng hiện đại.
- **Chart.js**: Biểu đồ thống kê.

## Hướng dẫn cài đặt và chạy trên máy tính (VS Code / Visual Studio)

### Cách 1: Chạy trực tiếp (Đơn giản nhất)
1. Tải toàn bộ mã nguồn về máy.
2. Mở thư mục bằng **Visual Studio Code**.
3. Cài đặt extension **Live Server**.
4. Chuột phải vào file `index.html` và chọn **Open with Live Server**.

### Cách 2: Sử dụng Node.js
1. Đảm bảo máy đã cài đặt [Node.js](https://nodejs.org/).
2. Mở terminal trong thư mục dự án.
3. Chạy lệnh: `npm install`
4. Chạy lệnh: `npm start`
5. Truy cập địa chỉ `http://localhost:3000` (hoặc cổng được hiển thị).

## Đưa lên Github
1. Tạo một repository mới trên Github.
2. Đẩy mã nguồn lên bằng các lệnh git cơ bản:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-url>
   git push -u origin main
   ```

## Lưu ý
Dữ liệu hiện tại được lưu trữ trong `localStorage` của trình duyệt, vì vậy dữ liệu sẽ được giữ lại khi bạn tải lại trang trên cùng một máy tính.
