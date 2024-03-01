# Giới thiệu
Đây là code đơn giản, không hỗ trợ giải captcha và auto login. Nhưng thoải mái sử dụng lâu dài.

Tự động lấy kiểm tra lịch sử giao dịch ngân hàng MB Bank. Đồng thời cập nhật biến động số dư và thông báo nhận tiền mới nhất gửi lên group telegram.
  
Các bạn có thể tải về mà tự chỉnh sửa để sử dụng cho mục đính của mình.
#Hướng dẫn sử dụng:
Yêu cầu môi trường Nodejs 18.x trở lên
1. Đăng nhập tài khoản MB Bank tại: `https://online.mbbank.com.vn`
2. Truy cập đến trang lịch sử giao dịch.
![https://github.com/2movn/mbbank-api/blob/main/img/1.png?raw=true](https://github.com/2movn/mbbank-api/blob/main/img/1.png?raw=true)
4. Chọn tài khoản cần sử dụng và phuột phải mở `insprect` sẽ xuất hiện công cụ của chrome, bấm sang tab `network` như ảnh.
![https://github.com/2movn/mbbank-api/blob/main/img/2.png?raw=true](https://github.com/2movn/mbbank-api/blob/main/img/2.png?raw=true)
6. Click vào `Truy vấn` - Truy vấn lịch sử giao dịch sẽ xuất hiện như ảnh. Từ đây ta lấy thông tin và nhập vào file config
![https://github.com/2movn/mbbank-api/blob/main/img/3.png?raw=true](https://github.com/2movn/mbbank-api/blob/main/img/3.png?raw=true)
Chỉnh sửa thông tin tại file `config/config.json`

```
{
    "sessionId": "bde12345-eeee-33cb-6584d-c4sdnghti162",
    "id_run": "2024022817182330",
    "token": "RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
    "cookie": "MBAnalyticsaaaaaaaaaaaaaaaa_session_=DLAKNKJHHOGOLAELHMLKHDHCCNBGHCIJEIHJKHDFPAGAGCKPJIBGBNFJDBFM; BIGipServerk8s_online_banking_pool_9712=3508273418.61477.0000; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3491496202.7466.0000; _ga=GA1.1.1820297405.1708632708; _ga_T1003L03HZ=GS1.1.1708632707.1.1.1708633941.0.0.0; MBAnalyticsaaaaaaaaaaaaaaaa_session_=DLBMNDEDJMBKENBPKOKLGPKIJCPLBLGFPHHGOCJEHFLMNGOGJINNLMAEKO; JSESSIONID=01C88871582E416",
    "deviceid": "8aa44tbb-mbib-0000-0000-202402226549871",
    "user": "0999999999",
    "accountNo": "0001111188888",
    "botToken": "HDHCCNBGHCIJEIHJKHDFPAGAGAGMDDEIEHOBMJMPIGMODFFDAFPHDMCKPHNPDDHAGOKICKCFH",
    "chat_id": "-411565487"
}
```

