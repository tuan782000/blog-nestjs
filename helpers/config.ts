// import { diskStorage } from 'multer';

// // Đây là một hàm trả về cấu hình lưu trữ.
// // Nhận vào một tham số folder là tên thư mục con nơi file tải lên sẽ được lưu.
// export const storageConfig = (folder: string) => {
//     // diskStorage: Phương thức của Multer, được sử dụng để lưu trữ file trên ổ đĩa cục bộ. Nó cho phép bạn tùy chỉnh:
//     diskStorage({
//         destination: `uploads/${folder}`, // estination: Thư mục lưu trữ file.
//         // filename: Tên file được lưu.
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + '-' + file.originalname);
//         }
//     });
// };

import { diskStorage } from 'multer';

export const storageConfig = (folder: string) =>
    diskStorage({
        destination: `uploads/${folder}`,
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
