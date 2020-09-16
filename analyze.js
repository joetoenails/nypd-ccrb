const { db, Officer, Complaint } = require('./server/db');
const fs = require('fs');
const path = require('path');

// const res = {
//   name: 'flare',
//   children: [],
// };

// Complaint.findAll({ raw: true })
//   .then((everything) => {
//     everything = everything.slice(0, -100);
//     everything.forEach((c) => {
//       build(res, c, ['complaintEthnicity', 'complaintGender', 'fadoType']);
//     });
//     console.log('res', res);

//     const data = JSON.stringify(res);
//     fs.writeFile(path.join('ethincity.json'), data, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log('done');
//       process.exit(0);
//     });
//   })
//   .catch((e) => console.log(e));

// Build funciton will make a shape like this
// const ethnicity = {
//   name: 'flare',
//   children: [
//     {
//       name: "Black",
//       children: [
//         {
//           name: 'Force',
//           children: [
//             {
//               name: "Physical Force",
//               complaints: []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       name: "Unknown",
//       children: []
//     },
//     {
//       name: "White",
//       children: []
//     },
//   ]
// }
// Gender: {
//         Fado: {
//           Allegation: [],
//       },
//     },
//   },
// };

function build(result, c, layers) {
  let currentObjectPlace = result;

  for (let i = 0; i < layers.length; i++) {
    if (c[layers[i]] === '') {
      c[layers[i]] = `Unknown ${layers[i]}`;
    }
    const curComplaintAttr = c[layers[i]];

    let categoryObject = currentObjectPlace.children.find(
      (category) => category.name === curComplaintAttr
    );
    if (!categoryObject) {
      categoryObject = {
        name: curComplaintAttr,
        children: [],
      };
      currentObjectPlace.children.push(categoryObject);
    }
    if (i === layers.length - 1) {
      categoryObject.children.push(c);
      if (categoryObject.value) {
        categoryObject.value++;
      } else {
        categoryObject.value = 1;
      }
    }
    currentObjectPlace = categoryObject;
  }
}

module.exports = { build };
