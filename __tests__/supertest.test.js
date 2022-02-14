const request = require("supertest");

// describe("/api/restaurants", () => {
//     describe("GET", () => {
//       test("status: 200 - responds with array of all restaurant objects", () => {
//         return request(app)
//           .get("/api/restaurants")
//           .expect(200)
//           .then((response) => {
//             // console.log(response.body.restaurants);
//             expect(response.body.restaurants).toHaveLength(8);
//             response.body.restaurants.forEach((restaurant) => {
//               expect(restaurant).toEqual(
//                 expect.objectContaining({
//                   restaurant_id: expect.any(Number),
//                   restaurant_name: expect.any(String),
//                   area_id: expect.any(Number),
//                   cuisine: expect.any(String),
//                   website: expect.any(String),
//                 })
//               );
//             });
//           });
//       });
//     });
//   });
