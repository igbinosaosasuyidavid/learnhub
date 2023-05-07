# Learnhub

### This is a simple LMS platform that is easy to use and understand.

Features

+ Course creation (Teacher)
+ Course enrollment (Student)
+ Course Purchase (Student) auto enroll after purchase
> For testing of course purchase
> Stripe card number : **4242 4242 4242 4242**
> Stripe expiry date : Any future date
> Stripe cvv : Any three (3) digits



Get Started [Sign up](https://thevalley-livid.vercel.app/auth/register).



You can signup as a teacher or a student.
A user model created is in the prisma folder in prisma.schema

Basic email and password authentication and the only extra field there is admin status

login route - /api/auth/login .... You can simpky call NextAuth sign in to save time
register route - /api/auth/custom_register This must be called as an api route because the regsiter process was customized
