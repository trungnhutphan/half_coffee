# KA Pods — marketing website và app demo tương tác

## 1. Mục tiêu

Dựng một website marketing có thể triển khai công khai hoặc dùng trực tiếp trong buổi thuyết trình để giới thiệu sản phẩm viên giặt KA Pods và minh hoạ trải nghiệm của ứng dụng khách hàng. Website phải tạo được ấn tượng trực quan ngay ở màn hình đầu, đồng thời cho phép người xem tự thao tác các tính năng chính mà không cần backend, tài khoản thật hay kết nối thanh toán.

Thành công được xác định bởi ba tiêu chí:

- Người xem hiểu KA Pods là viên giặt 4 trong 1 có khả năng kháng khuẩn sau phần giới thiệu đầu tiên.
- Người thuyết trình có thể đi qua một luồng demo mạch lạc gồm tích điểm, voucher và tìm điểm bán.
- Website hoạt động ổn định trên laptop trình chiếu và điện thoại, không có nút chính vô tác dụng.

## 2. Phạm vi

### Bao gồm

- Một landing page giới thiệu KA Pods bằng nội dung tiếng Việt.
- Một mô hình điện thoại tương tác đặt trực tiếp trong landing page.
- Các phần nội dung: tổng quan sản phẩm, lợi ích 4 trong 1, cách sử dụng, lựa chọn sản phẩm, bằng chứng kháng khuẩn và lời kêu gọi trải nghiệm app.
- Năm màn hình app demo: Trang chủ, Phần thưởng, Ví voucher, Điểm bán và Tài khoản.
- Các tương tác giả lập: chuyển màn hình, nhận điểm, đổi quà, lọc voucher, tìm kiếm điểm bán và chọn ngôn ngữ.
- Thiết kế responsive, điều hướng bàn phím, trạng thái focus và hỗ trợ `prefers-reduced-motion`.
- Build tĩnh để triển khai mà không cần máy chủ ứng dụng.

### Không bao gồm

- Đăng ký hoặc đăng nhập thật.
- API, cơ sở dữ liệu, hệ thống quản trị hay đồng bộ dữ liệu.
- Thanh toán, đặt hàng hoặc định vị GPS thật.
- Xác minh khoa học độc lập cho thông điệp marketing; website chỉ trình bày nội dung có sẵn trong bộ ảnh.
- Ảnh cá nhân `source/771870654_1087674896935603_2609919475889399333_n.jpg`, vì không liên quan đến KA Pods.

## 3. Hướng trải nghiệm

Website là một câu chuyện cuộn dọc với hai lớp trải nghiệm bổ trợ nhau:

1. Lớp marketing giải thích sản phẩm bằng hình ảnh thật, nội dung ngắn và bố cục giàu nhịp điệu.
2. Lớp app demo cho phép người xem thao tác trong mô hình điện thoại mà không rời khỏi trang.

Luồng thuyết trình đề xuất:

1. Mở trang ở hero để giới thiệu sản phẩm và thông điệp “Giặt sạch. Kháng khuẩn. Gọn trong một viên.”
2. Cuộn qua bốn lợi ích chính và cách sử dụng.
3. Mở mô hình app, nhận điểm thưởng sau một lần giặt giả lập.
4. Chuyển sang Ví voucher và đổi một ưu đãi.
5. Tìm một điểm bán mẫu để kết thúc bằng lời kêu gọi mua hàng.

Mọi thay đổi trạng thái phải phản hồi ngay trong giao diện bằng số điểm, trạng thái voucher, kết quả tìm kiếm hoặc thông báo ngắn. Tải lại trang sẽ đưa dữ liệu demo về trạng thái ban đầu để dễ lặp lại bài thuyết trình.

## 4. Kiến trúc giao diện

Ứng dụng được tổ chức thành một trang duy nhất với các vùng chức năng độc lập:

- `Header`: logo KA Pods, điều hướng đến các phần chính và CTA “Trải nghiệm app”.
- `Hero`: hình sản phẩm chủ lực, thông điệp cốt lõi và CTA cuộn đến app demo.
- `Benefits`: bốn lợi ích 4 trong 1 được trình bày như một hệ thống, không phải bốn thẻ giống nhau.
- `HowTo`: hướng dẫn ba bước sử dụng, có thứ tự rõ ràng.
- `ProductShowcase`: giới thiệu các quy cách bao bì từ ảnh nguồn.
- `Proof`: khu vực 99,9% kháng khuẩn và công thức Nhật Bản, dùng đúng ngữ cảnh nội dung ảnh hiện có.
- `AppDemo`: mô hình điện thoại và phần thuyết minh thay đổi theo màn hình đang mở.
- `Footer`: thông tin demo, liên kết quay lại đầu trang và CTA cuối.

Phần app demo chia thành các module state nhỏ:

- `navigation`: màn hình hiện tại và điều hướng dưới.
- `rewards`: điểm hiện có, hành động nhận điểm và đổi quà.
- `vouchers`: bộ lọc và trạng thái đã đổi/chưa đổi.
- `stores`: từ khoá tìm kiếm và danh sách điểm bán giả lập.
- `preferences`: ngôn ngữ và các tuỳ chọn tài khoản demo.

Dữ liệu sản phẩm, voucher và điểm bán là dữ liệu tĩnh trong mã nguồn. Không dùng browser storage vì trạng thái chỉ cần tồn tại trong phiên trình diễn hiện tại.

## 5. Hệ thống thị giác

### Bảng màu

- `Deep navy — #073B78`: chữ chính, điều hướng và nền tương phản.
- `KA aqua — #00A9A5`: hành động chính và chi tiết nhận diện.
- `Fresh green — #72C93D`: trạng thái thành công và lợi ích sạch.
- `Ice blue — #EAF8FC`: nền nội dung nhẹ.
- `Pure white — #FFFFFF`: không gian sạch và bề mặt app.
- `Signal red — #C91F37`: chỉ dùng cho dấu chứng nhận/công thức Nhật Bản lấy từ ảnh nguồn.

### Typography

Sử dụng một sans-serif hình học có hỗ trợ tiếng Việt cho phần thân và tiêu đề, với tiêu đề đậm, bo mềm để gợi cảm giác của viên gel. Không dùng chữ in hoa giãn cách làm nhãn trang trí. Nội dung giữ chiều dài dòng ngắn, dễ đọc khi trình chiếu.

### Bố cục và hình ảnh

- Hero bất đối xứng: nội dung ở trái, ảnh bao bì lớn ở phải, được đặt trong quầng nước trong thay vì khung card.
- Hình viên giặt trở thành motif xuyên suốt qua các mặt cắt bo hữu cơ và hiệu ứng trong suốt có kiểm soát.
- Mô hình điện thoại là điểm nhấn duy nhất có chiều sâu mạnh; các phần khác phẳng và thoáng để không cạnh tranh thị giác.
- Ảnh sản phẩm trong `source/` được dùng trực tiếp và đặt trên nền phù hợp; không tạo thêm ảnh AI.
- Chuyển động tự động chỉ dùng ở hero khi tải trang và dừng hoàn toàn khi người dùng yêu cầu giảm chuyển động. Các chuyển động còn lại chỉ phản hồi thao tác.

## 6. Nội dung chính

Thông điệp trung tâm:

> Giặt sạch. Kháng khuẩn. Gọn trong một viên.

Bốn lợi ích trình bày theo ngôn ngữ ngắn, dễ thuyết trình:

- Làm sạch quần áo trong một bước.
- Hỗ trợ kháng khuẩn 99,9% theo thông tin sản phẩm hiện có.
- Công thức 4 trong 1 giúp giảm thao tác đong nhiều sản phẩm.
- Viên giặt nhỏ gọn, dễ bảo quản và mang theo.

Các tuyên bố marketing không được mở rộng vượt quá thông tin thể hiện trong bộ ảnh. Không thêm chứng nhận, số liệu thử nghiệm hoặc đối tác mà repo không cung cấp.

## 7. Trạng thái và xử lý lỗi

- Nút nhận điểm bị vô hiệu hoá ngay sau khi nhận và hiển thị trạng thái hoàn tất.
- Voucher đã đổi chuyển sang trạng thái “Đã lưu”, không cho đổi lặp lại trong cùng phiên.
- Tìm điểm bán không có kết quả sẽ hiển thị hướng dẫn đổi từ khoá, không để vùng nội dung trống.
- Nếu ảnh tải lỗi, bố cục vẫn giữ kích thước và hiển thị văn bản thay thế có nghĩa.
- Các thao tác giả lập không mở liên kết ngoài hoặc tạo dữ liệu thật.
- Thông báo trạng thái dùng vùng `aria-live` để trình đọc màn hình nhận biết.

## 8. Responsive và khả năng truy cập

- Desktop ưu tiên bố cục hai cột để người thuyết trình vừa thấy lời giải thích vừa thao tác app.
- Tablet thu gọn khoảng cách nhưng giữ mô hình điện thoại bên cạnh nội dung khi đủ chỗ.
- Mobile xếp một cột; app demo chiếm gần toàn bộ chiều rộng và thanh điều hướng trong app vẫn chạm được bằng ngón tay.
- Kích thước vùng chạm tối thiểu 44px cho nút quan trọng.
- Màu chữ và CTA phải đạt độ tương phản phù hợp; không dùng màu làm tín hiệu duy nhất.
- Modal hoặc panel, nếu có, đóng được bằng phím Escape và quản lý focus đúng cách.

## 9. Kiểm thử và nghiệm thu

### Tự động

- Build sản phẩm hoàn tất mà không có lỗi.
- Kiểm thử state cốt lõi: nhận điểm một lần, đổi voucher một lần, lọc voucher và lọc điểm bán.
- Kiểm tra liên kết nội bộ, đường dẫn ảnh và metadata cơ bản.

### Thủ công

- Rà soát toàn bộ luồng thuyết trình ở kích thước laptop và mobile.
- Xác nhận tất cả CTA chính đều cuộn hoặc thay đổi trạng thái đúng.
- Kiểm tra điều hướng bàn phím, focus, Escape và reduced motion.
- Xác nhận không sử dụng ảnh cá nhân ngoài phạm vi và không có lỗi console.

## 10. Triển khai

Website được xuất dưới dạng static build, không khai báo database, secret hay dịch vụ backend. Bản hoàn thiện sẽ được triển khai bằng Sites để tạo một URL riêng tư phục vụ duyệt và thuyết trình. Metadata trang gồm tên KA Pods và mô tả tiếng Việt; không tạo ảnh social preview mới vì yêu cầu hiện tại không bao gồm hạng mục đó.
