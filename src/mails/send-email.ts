import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

type Props = {
   from?: string;
   to: string[];
   cc?: string;
   bcc?: string;
   subject: string;
   templateName: string;
   context: any;
};
export type EmailResponse = {
   statusCode: number;
   message: string;
   name: string;
};

type MailOptions = {
   from?: string;
   to: string[];
   cc?: string;
   bcc?: string;
   subject: string;
   template: any;
   context: any;
};
export default async function sendEmail({ to, cc, bcc, subject, from, context, templateName }: Props) {
   const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST, //if when gmail not work
      port: process.env.SMPT_PORT, //if when gmail not work
      service: process.env.SMPT_SERVICE,
      auth: {
         user: from || process.env.SMPT_MAIL, //simple mail protocol transfer
         pass: process.env.SMPT_PASSWORD,
      },
   } as any);

   const templatesPath = path.resolve("./src/mails/templates/");

   const hbsOptions = {
      viewEngine: {
         defaultLayout: false,
         extName: ".hbs",
         partialsDir: templatesPath,
      },
      viewPath: templatesPath, //,
      extName: ".hbs",
   };
   transporter.use("compile", hbs(hbsOptions as any));

   const mailOptions = () => {
      let options: MailOptions = {} as MailOptions;
      options.from = from || process.env.SMPT_MAIL;
      if (to) {
         options.to = to;
      }
      if (cc) {
         options.cc = cc;
      }
      if (bcc) {
         options.bcc = bcc;
      }
      if (subject) {
         options.subject = subject;
      }
      if (templateName && context) {
         options.template = templateName;
         options.context = context;
      }
      return Object.freeze(options);
   };
   let info = await transporter.sendMail(mailOptions());
   return info;
}
/*
  await sendEmail({
         to: [body?.email],
         subject: `${project?.name} invites you!`,
         templateName: "allocation-request.mail",
         context: {
            project_name: project?.name,
            app_name: "project buddy",
            link: `${FRONTEND_URL}/project-verification/2545?confirmation_token=b28fa66339bfd2d2477f`,
         },
 });

*/
