import db from "./mongodb.js";
import { Bson } from "./deps.js";

const peopleCollection = db.collection("people");

const getAllPeople = async (ctx) => {
  const people = await peopleCollection.find().toArray();
  ctx.response.body = people;
};
const getPerson = async (ctx) => {
  const id = ctx.params.id;

  const person = await peopleCollection.findOne({
    _id: new Bson.ObjectId(id),
  });
  if (!person) {
    ctx.response.body = "No Person was found";
  }
  ctx.response.body = person;
};

const addPerson = async (ctx) => {
  const newUser = await ctx.request.body().value;
  const id = await peopleCollection.insertOne(newUser);
  newUser._id = id;

  ctx.response.status = 201;
  ctx.response.body = newUser;
};

const updatePerson = async (ctx) => {
  const user = await ctx.request.body().value;
  const filter = { _id: new Bson.ObjectId(user._id) };
  const update = { $set: { name: user.name } };
  ctx.response.status = 201;
  ctx.response.body = user;
  return await peopleCollection.updateOne(filter, update);
};

const deletePerson = async (ctx) => {
  const id = ctx.params.id;
  const deleteCount = await peopleCollection.deleteOne({
    _id: new Bson.ObjectId(id),
  });
  ctx.response.body = deleteCount;
};

export { getAllPeople, getPerson, addPerson, updatePerson, deletePerson };
