const request = require("supertest");
const { app, closeServer } = require("./index");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("GET /standings", () => {
  beforeAll(async () => {
    await delay(1000);
  });

  it("should return 200 with valid query parameters", (done) => {
    request(app)
      .get("/standings")
      .query({
        season: "2013-14",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const standings = res.body;
        standings.forEach((standing) => {
          if (standing.Season !== "2013-14") {
            throw new Error(`Invalid season in response: ${standing.Season}`);
          }
        });
        done();
      });
  });

  it("should return 400 if season format is invalid", (done) => {
    request(app)
      .get("/standings")
      .query({
        season: "invalid-season-format",
      })
      .expect(400, done);
  });

  it("should return 400 if searchTeam contains numbers", (done) => {
    request(app)
      .get("/standings")
      .query({
        searchTeam: "TeamWithNumbers123",
      })
      .expect(400, done);
  });

  it("should return 400 if wins[gte] is a negative value", (done) => {
    request(app)
      .get("/standings")
      .query({
        wins_gte: -1,
      })
      .expect(400, done);
  });

  it("should return 400 if ordering is invalid", (done) => {
    request(app)
      .get("/standings")
      .query({
        ordering: "invalid-ordering",
      })
      .expect(400, done);
  });

  afterAll((done) => {
    closeServer(done);
  });
});