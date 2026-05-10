// import * as svgCaptcha from 'svg-captcha';



// @Get('captcha')
// getCaptcha(@Req() req: any) {
//   const captcha = svgCaptcha.create({
//     size: 5, // jumlah huruf
//     noise: 2,
//     color: true,
//   });

//   // simpan ke session (atau cache)
//   req.session.captcha = captcha.text;

//   return {
//     data: captcha.data, // SVG image
//   };
// }