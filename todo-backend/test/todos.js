process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Create", () => {
  it("it should create a new ToDo", (done) => {
    chai
      .request(server)
      .post("/api/v1/todos")
      .send({ text: "This is a new ToDo" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("text");
        res.body.should.have.property("done");
        res.body.done.should.be.eql(false);
        done();
      });
  });
});

let todoId;

describe("Update", () => {
  it("it should create and update a ToDo", (done) => {
    chai
      .request(server)
      .post("/api/v1/todos")
      .send({ text: "This is a new ToDo" })
      .end((err, res) => {
        // Store the ToDo ID so we can use it later.
        todoId = res.body.id;

        chai
          .request(server)
          .put(`/api/v1/todos/${todoId}`)
          .send({
            done: true,
          })
          .end((err, res) => {
            res.body.done.should.be.eql(true);
          });

        chai
          .request(server)
          .delete(`/api/v1/todos/${todoId}`)
          .end((err, res) => {
            res.should.have.status(204);
          });
      });

    done();
  });
});

describe("Delete", () => {
  it("it should delete a ToDo", (done) => {
    chai
      .request(server)
      .post("/api/v1/todos")
      .send({ text: "This is a new ToDo" })
      .end((err, res) => {
        // Store the ToDo ID so we can use it later.
        todoId = res.body.id;

        chai
          .request(server)
          .delete(`/api/v1/todos/${todoId}`)
          .end((err, res) => {
            res.should.have.status(204);
          });
      });

    done();
  });

  it("it should remove all done ToDos", (done) => {
    let requester = chai.request(server);
    let updateRequests = chai.request(server);

    Promise.all([
      requester.post("/api/v1/todos").send({ text: "First ToDo" }),
      requester.post("/api/v1/todos").send({ text: "Second ToDo" }),
      requester.post("/api/v1/todos").send({ text: "Third ToDo" }),
    ])
      .then((responses) => {
        let firstId = responses[0].body.id;
        let thirdId = responses[2].body.id;

        Promise.all([
          updateRequests.put(`/api/v1/todos/${firstId}`).send({ done: true }),
          updateRequests.put(`/api/v1/todos/${thirdId}`).send({ done: true }),
        ])
          .then(() => {
            chai
              .request(server)
              .delete("/api/v1/todos")
              .then(() => {
                chai
                  .request(server)
                  .get("/api/v1/todos")
                  .end((err, res) => {
                    console.log(res.body);
                  });
              });
          })
          .then(() => updateRequests.close());
      })
      .then(() => requester.close());
    done();
  });
});
