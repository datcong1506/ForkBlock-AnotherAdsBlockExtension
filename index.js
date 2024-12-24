const { QRPay, BanksObject } = require('vietnam-qr-pay')
const controller=require('./controllers/controller')
const view=require("./views/views")


const qrPay = QRPay.initVietQR({
    bankBin: BanksObject.vietinbank.bin,
    bankNumber: '103870479837', // Số tài khoản
  })
const content = qrPay.build()
console.log(content)


if(false){
    controller.Init();
    view.Init()
}
