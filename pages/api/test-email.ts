import { NextApiRequest, NextApiResponse } from "next";

import Imap from "imap";
import imap from 'imap';

async function getEmails(): Promise<void> {
    const imapConfig: imap.Config = {
        user: process.env.MARQUETTE_EMAIL as string,
        password: process.env.MARQUETTE_GMAIL_PASS as string,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
            rejectUnauthorized: false
          }
      };

    // user imap to get all emails and print their sender and subject
    const imapConnection = new Imap(imapConfig);
    console.log(imapConfig)

    const openInbox = (cb: (err: Error | null, box: Imap.Box) => void) => {
        imapConnection.openBox('INBOX', true, cb);
    }

    const fetchEmails = (cb: (err: Error | null, emails: Imap.ImapMessage[]) => void) => {
        imapConnection.search(['ALL'], (err, results) => {
            if (err) {
                cb(err, []);
            }
            const f = imapConnection.fetch(results, { bodies: '' });
            let emails: Imap.ImapMessage[] = [];
            f.on('message', (msg, seqno) => {
                emails.push(msg);
            });
            f.once('error', (err) => {
                cb(err, []);
            });
            f.once('end', () => {
                cb(null, emails);
            });
        });
    }

    const parseEmails = (emails: Imap.ImapMessage[], cb: (err: Error | null, parsedEmails: any[]) => void) => {
        let parsedEmails: any[] = [];
        console.log(emails)
        emails.forEach((email) => {
            // recall that our goal is to print the sender and subject line
            const from = email['from'];
            const subject = email['subject'];
            const to = email['to'];
            parsedEmails.push({ from, subject });
            console.log(subject, to)
        });
        cb(null, parsedEmails);
    }

    const closeConnection = () => {
        imapConnection.end();
    }

    imapConnection.once('ready', () => {
        openInbox((err, box) => {
            if (err) {
                throw err;
            }
            fetchEmails((err, emails) => {
                if (err) {
                    throw err;
                }
                parseEmails(emails, (err, parsedEmails) => {
                    if (err) {
                        throw err;
                    }
                    console.log(parsedEmails);
                    closeConnection();
                });
            });
        });
    })

    imapConnection.once('error', (err) => {
        console.log(err);
    })

    imapConnection.once('end', () => {
        console.log('Connection ended');
    })

    imapConnection.connect();
  }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const emails = await getEmails();
    res.status(200).json("test");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching emails" });
  }
};

export default handler