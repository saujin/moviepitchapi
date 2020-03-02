'use strict';

(function (emailService) {

  let Promise = require('bluebird');
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let sendgrid = require('sendgrid')(process.env.SENDGRID_ACCESS_TOKEN);

  emailService.send = function (payload) {
    return new Promise(function (resolve, reject) {
      let newEmail = new sendgrid.Email({
        to: payload.to,
        from: payload.from,
        subject: payload.subject,
        text: payload.text
      });

      // console.log(newEmail)

      // newEmail.setFilters({
      //   'templates': {
      //     'settings' : {
      //       'enable': 1,
      //       'template_id': '97f77b82-9315-4e95-9f50-936e697a3138'
      //     }
      //   }
      // });

      sendgrid.send(newEmail, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  emailService.contactUs = function (payload) {

    return new Promise(function (resolve, reject) {
      sendgrid.send(payload, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  function appendedText(pitch) {
    let dateSubmitted = new Date()

    if(pitch.termsAcceptedTime){
      dateSubmitted = new Date(pitch.termsAcceptedTime);
    }
    const monthName = monthNames[dateSubmitted.getMonth()]
    const day = dateSubmitted.getDay()
    const year = dateSubmitted.getFullYear()
    return `This email is in regards to the following pitch: "${pitch.pitchText}" submitted on ${monthName} ${day}, ${year}`
  }
  emailService.getPayload = function (pitchStatus, pitch) {
    var payload = {
      to: pitch.submitterEmail,
      from: 'admin@moviepitch.com'
    };
    const text = appendedText(pitch)
    switch (pitchStatus) {
      case 'unreviewed':
        payload.subject = 'Your movie idea has been successfully submitted to Moviepitch.com';

        payload.text =
        `Thank you for submitting your idea to Moviepitch.com. Your pitch will soon be read and reviewed by our team, and we'll update you once a decision is made.\n\nIn the meantime, keep the good ideas coming!\n\nAll the best,\n\nRobert Kosberg & The Moviepitch.com Team \n\n${text}`;
        break;

      case 'accepted':
        payload.subject = 'Congratulations! Your pitch idea has been accepted';

        payload.text = `Congratulations! We're happy to let you know that the team at Moviepitch has reviewed your project and have decided that we would like to now pitch your idea to our best contacts, and see if we can help you get this project officially set up with a buyer.\n\nIf anyone responds, we will immediately notify you, and this will be the time for ourselves and you to draw up a preliminary deal memo (contract) that will lay out all the specific financial terms... so that you will know exactly what to expect as your project moves into Active Development with a buyer... on its way to hopefully becoming a movie.\n\nThank you for your submission, and we will be contacting you soon.\n\nAll the best,\n\nRobert Kosberg & The Moviepitch.com Team \n\n${text}`;
        break;

      case 'delayed-rejection':
        payload.subject = 'Your pitch idea has been declined';

        payload.text = `Thank you again for submitting your idea to Moviepitch.com. As you know, we did carefully review and discuss your idea with our team, as we did have an initial, positive response to your pitch.\n\nUnfortunately, after serious consideration, it's been decided that this project is not quite right for us, and we are respectfully passing on the project. (Though, we may contact you again at a later date, to see if your project is still available.)\n\nPlease know that the more ideas you submit, the better your chances are that we will respond positively. After all, every movie ever made... began with a simple idea.\n\nWe look forward to reading more of your ideas and thanks again for submitting.\n\nAll the best,\n\nRobert Kosberg & The Moviepitch.com Team \n\n${text}`;
        break;

      case 'rejected':
        payload.subject = 'Your Moviepitch.com pitch idea has been declined';

        payload.text = `Thank you for submitting your idea to Moviepitch.com. Your pitch was read and reviewed by our team, but unfortunately, it was not quite right for us at this time.\n\nFor now, we are passing on your pitch, but we look forward to receiving and reviewing any other ideas you might like us to consider.\n\nPlease know that the more ideas you submit, the better your chances are that we will respond positively. After all, every movie ever made... began with a simple idea.\n\nWe look forward to reading more of your ideas and thanks again for submitting.\n\nAll the best,\n\nRobert Kosberg & The Moviepitch.com Team \n\n${text}`;
        break;

      default:
        throw new Error("pitch status unknown!");
    }

    return payload;
  }

})(module.exports);
