const Imap = require('imap');
const {simpleParser} = require('mailparser');
const imapConfig = {
  user: 'news@honeynine.wiki',
  password: 'Hello@123',
  host: 'mail.honeynine.wiki',
  port: 993,
  tls: true,
};


const getEmails = () => {
    try {
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['UNSEEN', ['SINCE', new Date()]], (err, results) => {
            const f = imap.fetch(results, {bodies: ''});
            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream, async (err, parsed) => {
                const {from, subject, textAsHtml, text} = parsed;
                  console.log(from);
                  console.log(subject);
                  console.log(textAsHtml);
                  console.log(text);

                  
                });
              });
              msg.once('attributes', attrs => {
                const {uid} = attrs;
                imap.addFlags(uid, ['\\Seen'], () => {
                  console.log('Marked as read!');
                });
              });
            });
            f.once('error', ex => {
              return Promise.reject(ex);
            });
            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      });
  
      imap.once('error', err => {
        console.log(err);
      });
  
      imap.once('end', () => {
        console.log('Connection ended');
      });
  
      imap.connect();
    } catch (ex) {
      console.log('an error occurred');
    }
  };
  
  getEmails();