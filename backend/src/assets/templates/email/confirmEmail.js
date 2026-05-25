let confirmEmailTemplate = `
<html>
  <body>
    <div>
      <center>
          <p> Click confirm button for confirm your email address </p>
          <a href="{{CONFIRM_EMAIL_LINK}}" style="background-color: #007bff; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Confirm</a>
      </center>
    </div>
  </body>
</html>
`;

module.exports = confirmEmailTemplate;
