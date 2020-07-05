$("#contactForm").submit(function(e){
    e.preventDefault();
    let fd = e.target.elements;
    $('#response').html('Sending . . .');

    Email.send({
      SecureToken: "d9976e71-fd68-4667-b3e8-35b05eb0e2a1",
      To : 'yiyubruceliu@gmail.com',
      From : "info@fintechcampus.co.za",
      Subject : "Letter of appreciation",
      Body : `Thank you for inviting me to the second round of interviews. I would like to bring a small security issue with me tomorrow regarding this email.

Regards`
    }).then(s => {
      // display success message
      $('#response').html('Message Sent!');
      // reset contactForm
      $('#contactForm').trigger("reset");
    })
});