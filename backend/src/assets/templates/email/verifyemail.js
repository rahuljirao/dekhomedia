let verifyEmailTemplate = `
<html>
  <body>
    <div>
      <center>
        <h1> Your Otp is {{OTP_VALUE_BODY}} </h1>
        <h5> To verify your email, click on thin link --->  {{OTP_VALUE_BODY}} </h5>
      </center>
    </div>
  </body>
</html>
`;

module.exports = verifyEmailTemplate;
