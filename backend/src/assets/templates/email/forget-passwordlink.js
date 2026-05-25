let forgetPasswordEmail = `
<html>
  <body>
    <div>
      <center>
        
          <a href="{{EMAIL_VERIFY_LINK}}" style="background-color: #007bff; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Verify</a>
       
      </center>
    </div>
  </body>
</html>
`;

module.exports = forgetPasswordEmail;
