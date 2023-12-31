# DigitalHippo

## dependencies

- yarn create next-app --typescript
- yarn add lucid-react
- npx shadcn-ui@latest init
- npx shadcn-ui@latest add button
- npx shadcn-ui@latest add sheet
- npx shadcn-ui@latest add separator
- npx shadcn-ui@latest add input
- npx shadcn-ui@latest add dropdown-menu
- npx shadcn-ui@latest add label
- npx shadcn-ui@latest add skeleton
- npx shadcn-ui@latest add scroll-area
- yarn add express
- yarn add date-fns
- yarn add dotenv
- yarn add payload
- yarn add cross-env
- yarn add resend (for email)
- yarn add sonner
- yarn add @react-email/components
- yarn add body-parser
- yarn add @payloadcms/richtext-slate @payloadcms/bundler-webpack @payloadcms/db-mongodb
  - can also choose lexigal
- yarn add react-hook-form @hookform/resolvers zod sonner
- yarn add @trpc/client @trpc/next @trpc/react-query @trpc/server @tanstack/react-query
  - yarn add @tanstack/react-query@4.36.1
- (run for types from our schema)
  - yarn generate:types
- yarn add nodemailer
- yarn add swiper
- yarn add zustand
- see which port is running on 3000
  - sudo lsof -i :3000
  - kill -9 9766
- yarn add stripe
- yarn lint
  - check to see if any code is going to cause an issue

## deployment on railway

- nah let's use Vercel
- https://digital-hippo-im50b8kb2-william-runyons-projects.vercel.app/
  - then add /api/webhooks/stripe because we defined it this way in server.ts
  - checkout.session.completed

## Build

- Change tsconfig module to "CommonJS" and moduleResolution to "node"
- React refers to UMD global error
  - import \* as React from 'react'
- yarn add -D copyfiles

## Get user

- cookies() passed into getServerSideUser(cookies_param)

## origin return meaning

- /sign-in?origin=thank-you?orderId=${order.id}
  - brings the user back to the origin page later (because of the logic we implemented)

## align image on the left half

- relative parent
  - absolute child wrapped around Image with h defined and w-1/2

## Checkout process

- once payment is made, we go to thank you page and keep polling the server to see isPaid is true

## stripe

- add secret key
- logic in payment-router.ts
- Create line_item in stripe dashboard
  - copy API ID from "Create Product" page where you can add recurring or single time transaction
- we made priceId and stripeId get generated programtically which is why we need to handle it in our beforeChange hook within Products collection
- isPaid is defined in server.ts
  - and further defined in webhooks.ts
- create custom webhook from dashboard
  - Want to do this from our official production url

## how to size images properly

- /app/cart/page.tsx

## zustand -> cart logic

- create custom hook that is used in AddToCart and /app/product/[productId] and Cart.tsx
- any react hooks require 'use client'
- add <ScrollArea> to make smooth

## swiper

- add css styles to components where it is used
- added extra styles in global.css for circle to turn from blue to white

## js

- can add files to object by indexing its key and it will create new assignments during runtime
- flatMap() -> same as .map().flat()
- .reduce is good when we want to go over an array and keep adding a total from a previous component
  - example in .Cart.tsx

## tanstack

- useQuery
  - {} represents object passed in for data
  - {} has extra params for enabled and refetchInterval (PaymentStatus example)
- useInfiniteQuery()
  - grabs more content as you scroll
-

## sonner

- Add <Toaster/> to layout.tsx

## resend for emails (also Brevo looks nice)

- email automatically sent via payload ORM through get-payload.ts
- /collections/Users.ts defines message to send to "users" when they are created
  - directs users to localhost:3000/verify-email?token=${token}
  - if email link is clicked, token is generated
- can use email templates they have configured from demo.react.email

## types

- Users
  - Seller
  - Buyers

## forms

- You can either grab form input by attaching id's to elements and then putting an action={onSubmit} on the form tag where you have formData: FormData and you use formData.get() as string and then have some useAction hook to validate with zod that the types are correct
- Or, you can use useForm which takes in a generic type (which gives info as to what should be passed in / returned) and 'useForm' accepts a zodResolver which does type safety from the server component directly
  - You use onSubmit={handleSubmit(onSubmit)} on the form component with this method where handleSubmit was a prop from 'useForm' and onSubmit is a custom method we write
  - If you {...register('email')} or 'password' in a prop, this identifies which components are which

## trpc

- typescript for frontend and backend
- create /trpc folder with files provided
- add /app/api/trpc/[trpc]/route.ts that has a GET and POST handler
- from client component, we can say const { data } = trpc.anyApiRoute.useQuery(); where anyApiRoute is defined within our index.ts in /trpc
  - this allows for type safety for every query we make
- get-payload.ts
- /app/collections has collections of Users (sellers and buyers)
  - Add this to payload.config.ts to have extra options
- in auth-router.ts, had to change from "@" path to fix problem. Added "../../" instead
- automatically hashes password
- auth-router.ts is where we are creating our callable methods on the frontend

## payload-utls

- Create custom component that gives us User verification as to whether or not they signed in

## nodemon

- anything you add to "watch" will be reloaded

## collections

- User
  - Can add // condition: ({req}) => req.user.role === 'admin' to only have admins see the page, or false

## Sign in

- will have a ?as=seller url for sellers
- router.push("?as=seller") just adds param to end
- router.replace("/sign-in", undefined) makes "sign-in the route and takes off all other params

## Sign up

- Use a form
- use focus-visible:ring-red-500 for error state
  - className={cn({"focus-visible:ring-red-500": errors.email,})}
- useForm abstracts away the need to but id's on each element and to track each element's changes
  - pass into resolver a z.object schema and put the type of TAuthCredentialsValidator with z.infer into useForm<> for true type safety for functions like 'register' which you get back from useForm()
- pass in {...register("password")} or {...register("email")} as props to Input component and that's all you need to do
- <form onSubmit={handleSubmit(onSubmit)}>

## Auth

- we will capture token from email that is sent to /verify-email with ?token=<token>

## next.js

- export { handler as GET, handler as POST };
  - allows handler to recieve GET and POST requests
- can destructure searchParams from server component or access from front end via useSearchParams()

## Mongodb

- connect with drivers since we are using node.js

## self host

- checkout server.ts to see an example of how to make next.js more flexible for things like websockets which vercel doesn't normally support
- change in package.json dev command from this to this
  - "dev": "next dev",
  - 'dev': "cross-env PAYLOAD_CONFIG_PATH=app/payload.config.ts nodemon"

## payload CMS

- in /app/payload.config.ts
- add nodemon.json in root directory
- add tsconfig.server.json to root directory as well
- payload.config.ts allows us to define the route (in this case /sell)

## express Admin dashboard

- add server.ts to /app directory and get-payload.ts
  - can get path from 'path'

## draw template

- excalidraw.com

## prettify currency

- /lib/utils formatPrice

## identifying when you click out of a section

- use a useRef<HTMLDivElement | null>
- can add ref prop to div

## Event listener

- These two things are the same
  - document.addEventListener("keydown", handler)
  - document.addEventListener("keydown", (e) => handler(e))
- avoid memory leaks
  - return () => document.removeEventListener("keydown", handler)

## shadcn

- Select theme from website and copy css style in global.css
- Can add buttonVariants() className to Link component to apply button style from styles we chose at the beginning
  - className={buttonVariants({ variant: "ghost" })}
- asChild disables components like SheetTrigger from trying to wrap all child elements as a button

## lucide icons

- ludice.dev has list of icons
- Can add Icons component which ...props and can let you load in unique SVG's by defining their name

## generics

- useState<null | number> defines it can be null or a number

## tailwind

- making something absolute and then inset-x-0 makes left and right 0px which makes it effectively stretch full
- sometimes parent div orients the content, next layer styles the shadow
- flow-root
  - puts element in unique block

## typescript

- define type example in NavItem.tsx
- PropsWithChildren is an interface that exists that enables you to avoid write {children}: {children: React.ReactNode}
- add to package.json "generate:types": "cross-env PAYLOAD_CONFIG_PATH=app/payload.config.ts payload generate:types"
  - Then payload.config.ts will put this generated content where we defined payla-types.ts
- to remove undefined | null
  - Make sure undefined and null are factored out by casting as Boolean and then as string[] array

## images

- add object-cover and object-center
- for <Image/> add 'fill' property

## navbar

- because parent is relative, child drop is down is absolute and since parent has defined height as well, we can say top-full on the children component and have it pushed directly under the navbar section

## notes

- MaxWidthWrapper creates custom wrapper to contain content
- trpc is not compataible with most recent of tanstack query so we have to downgrade from 5 to 4
