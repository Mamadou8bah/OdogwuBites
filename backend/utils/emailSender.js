const { template } = require('handlebars')
const {transporter}=require('../config/emailConfig')
const dotenv=require('dotenv')

const sendEmailVerificationEmail=async (to,name,link)=>{
    try{
      await transporter.sendMail({
        from:process.env.USER_NAME,
        to,
        subject:'Verify your Email!',
        template:'verification',
        context: {
            name: name,
            link: link
        },
        attachments: [{
            filename: 'logo.png',
            path: './utils/logo.png',
            cid: 'logo'
        }]
      })
    }catch(error){
        console.error(error)
    }
}

const sendPasswordResetEmail= async(to,name,link)=>{
  try{
    await transporter.sendMail({
      from:'Odogwo Bites',
      to,
      subject:'Reset Your password',
      template:'reset',
      context: {
            name: name,
            link: link
      },
      attachments:[
        {
          filename: 'logo.png',
            path: './utils/logo.png',
            cid: 'logo'
        }

      ]

    })

  }catch(error){
    console.error(error)
  }
}

module.exports={sendEmailVerificationEmail,sendPasswordResetEmail};

