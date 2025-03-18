import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

const prisma = new PrismaClient();

await prisma.user.createMany({
  data: [
    { 
      name: 'Alice',
      email: "alice@gmail.com",
      phoneNumber: "1234567890"
    },
    { 
      name: 'Bob',
      email: "Bob@gmail.com",
      phoneNumber: "123456789"
    }
  ]
})

const users=await prisma.user.findMany();

app.get('/users', (c) => {
  return c.json(users);
})

app.post('/users', async (c) => {
  const { name, email, phoneNumber } = await c.req.json();
  const user = await prisma.user.create({
    data: { name, email, phoneNumber }
  });
  return c.json(user);
});

app.patch('/users/:id', async (c) => {
  const id = c.req.param('id');
  const { name, email, phoneNumber } = await c.req.json();
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, phoneNumber }
  });
  return c.json(user);
});

app.delete('/users/:id', async (c) => {
  const id = c.req.param('id');
  await prisma.user.delete({
    where: { id: Number(id) }
  });
  return c.text('User deleted');
});