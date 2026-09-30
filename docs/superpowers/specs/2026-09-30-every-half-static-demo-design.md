# Every Half — static interactive demo

## Mục tiêu

Biến bốn mockup Every Half hiện có thành một website demo responsive, nơi người xem có thể đi hết hành trình đặt món mà không cần đăng nhập, API hay cơ sở dữ liệu. Thành công là toàn bộ nút chính phản hồi rõ ràng và dẫn người xem từ chọn món đến xác nhận đơn.

## Phạm vi

- Một ứng dụng tĩnh, chạy bằng HTML, CSS và JavaScript thuần.
- Bốn vùng giao diện: Trang chủ, Menu, Giỏ hàng/thanh toán và Xác nhận đơn.
- Dữ liệu món, giá, ưu đãi và cửa hàng là dữ liệu mẫu trong mã nguồn.
- Trạng thái giỏ hàng chỉ ở trình duyệt trong phiên hiện tại; tải lại trang sẽ trở về dữ liệu demo ban đầu.

Không bao gồm: tài khoản, thanh toán thật, kiểm tra tồn kho, API, database, quản trị đơn hàng hay gửi email.

## Luồng tương tác

1. Trang chủ giới thiệu ưu đãi và có nút “Đặt món ngay”, đưa người xem tới Menu.
2. Menu hỗ trợ chọn danh mục, tìm nhanh theo tên, thêm món và mở bảng tuỳ chọn món.
3. Mỗi lần thêm món, huy hiệu giỏ hàng và thanh tóm tắt đơn cập nhật ngay; có thông báo ngắn xác nhận hành động.
4. Giỏ hàng cho phép tăng/giảm số lượng, xoá món và xem tổng tiền.
5. Trang thanh toán cho phép chọn nhận tại cửa hàng/giao hàng và phương thức thanh toán demo.
6. “Xác nhận đơn” hiển thị mã đơn và trạng thái thành công giả lập, đồng thời có nút quay về menu hoặc tạo đơn mới.

## Kiến trúc và giao diện

- `index.html`: khung một trang, điều hướng bằng các section và modal.
- `styles.css`: hệ màu kem, nâu cà phê và tím điểm nhấn lấy cảm hứng từ mockup hiện có; ưu tiên màn hình di động nhưng mở rộng tốt trên desktop.
- `app.js`: nguồn dữ liệu mẫu, state giỏ hàng, render UI và toàn bộ event handlers.
- Các màn hình được chuyển trong cùng một trang để thao tác mượt và dễ demo trên static hosting.

Hệ thống màu: nền `#F6F3EF`, bề mặt `#FFFFFF`, nâu cà phê `#644A38`, nâu đậm `#342217`, tím thao tác `#6C48C5`, xanh thành công `#16A34A`.

Phong cách giữ tính ấm áp, gọn và thủ công của quán specialty coffee: typography sans-serif dễ đọc, ảnh đồ uống nổi bật, CTA tím chỉ dùng cho thao tác đặt món/thanh toán, không lạm dụng thẻ hoặc hiệu ứng trang trí.

## Xử lý trạng thái và lỗi

- Giỏ hàng trống sẽ vô hiệu hoá nút thanh toán và hướng người xem quay lại Menu.
- Không cho giảm số lượng dưới 1; xoá món cần thao tác riêng.
- Các nút điều hướng luôn cuộn hoặc chuyển đến vùng hợp lệ; không có liên kết `#` vô tác dụng.
- Tương tác bằng bàn phím có focus rõ ràng; modal đóng bằng nút đóng hoặc phím Escape.

## Kiểm thử và nghiệm thu

- Kiểm thử tự động các hành vi state cốt lõi: thêm món, đổi số lượng, tính tổng, xoá món và chặn thanh toán khi giỏ trống.
- Kiểm thử thủ công tại kích thước mobile và desktop: điều hướng, tìm kiếm, chọn danh mục, modal, thanh toán demo và reset đơn.
- Rà soát bằng trình duyệt rằng không có lỗi console và mọi CTA chính đều hoạt động.

## Phát hành

Sản phẩm là static site, sẵn sàng đưa lên bất cứ host tĩnh nào. Vì chưa có nền tảng/tài khoản hosting được chỉ định, giai đoạn này chỉ tạo bản build có thể mở hoặc chạy bằng web server cục bộ; việc publish công khai sẽ cần chọn đích triển khai.
