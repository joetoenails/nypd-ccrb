const db = require('./server/db');
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

function build(result, complaint, layers) {
  let currentObjectPlace = result;
  for (let i = 0; i < layers.length; i++) {
    if (!complaint[layers[i]] || complaint[layers[i]] === 'Not described') {
      complaint[layers[i]] = `Unknown`;
    }
    const curComplaintAttr = complaint[layers[i]];

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
      if (categoryObject.value) {
        categoryObject.value++;
      } else {
        categoryObject.value = 1;
      }
    }
    currentObjectPlace = categoryObject;
  }
}

// by allegations, maybe we can make by complaints as well?
function buildLinks(allegations) {
  const links = [];
  const complaintsById = {
    // complaintId:  [{unique_mos_id, first_name, last_name}]
  };
  // make obj of complaintsById that hold arr of each officer in each complaint
  allegations.forEach((allegation) => {
    if (allegation.complaint_id in complaintsById) {
      let officer = complaintsById[allegation.complaint_id].find(
        (o) => o.unique_mos_id === allegation.unique_mos_id
      );
      if (!officer) {
        complaintsById[allegation.complaint_id].push(
          getOfficerDetails(allegation)
        );
      }
    } else {
      complaintsById[allegation.complaint_id] = [getOfficerDetails(allegation)];
    }
  });

  // go through complaints and make links

  for (const complaint in complaintsById) {
    // make a link between all officers in complaint and continue to increase the qty if needed
    const arrOfOfficersInComplaint = complaintsById[complaint];

    for (let i = 0; i < arrOfOfficersInComplaint.length; i++) {
      const initialOfficer = arrOfOfficersInComplaint[i];
      for (let j = i + 1; j < arrOfOfficersInComplaint.length; j++) {
        const nextOfficer = arrOfOfficersInComplaint[j];
        // look for an already established link in links arr where the source or target is equal to the two officers you are establishing a link between

        const possibleLink = links.find((link) => {
          return (
            (link.source === initialOfficer.unique_mos_id &&
              link.target === nextOfficer.unique_mos_id) ||
            (link.target === initialOfficer.unique_mos_id &&
              link.source === nextOfficer.unique_mos_id)
          );
        });
        if (possibleLink) {
          possibleLink.qty++;
        } else {
          links.push({
            source: initialOfficer.unique_mos_id,
            target: nextOfficer.unique_mos_id,
            initialOfficer,
            nextOfficer,
            qty: 1,
          });
        }
      }
    }
  }
  return links;
}

function buildNodes(linksArr) {
  const uniqueIds = {};
  linksArr.forEach((link) => {
    if (!(link.source in uniqueIds)) uniqueIds[link.source] = w;
    if (!(link.target in uniqueIds)) uniqueIds[link.target] = true;
  });

  return Object.keys(uniqueIds);
}
function getOfficerDetails(allegation) {
  const { unique_mos_id, first_name, last_name } = allegation;
  return { unique_mos_id, first_name, last_name };
}

// takes pre-processed links and nodes and returns links and nodes from one node with unique_mos_id
function makeGraphForSingleOfficer(id, nodes, links) {
  // go through links and get every link that has source or target equal to id
  const allIds = {};
  const queue = [];
  console.log(id);
  console.log(links[0]);
  links.forEach((n) => {
    if (n.source === id || n.target === id) {
      // if any link contains primary officer, add it to queue
      queue.push(n);
    }
  });
  const visited = new Map();
  const linksByOfficer = [];
  // put those links into queue
  while (queue.length) {
    const link = queue.shift();
    if (visited.has(link)) continue; // if we have already processed, continue
    visited.set(link, true);
    linksByOfficer.push(link); // this will be a link for graph
    allIds[link.source] = true; // this will help generate nodes later
    allIds[link.target] = true;

    for (let i = 0; i < links.length; i++) {
      // for every new link in the queue we need to check to see if a relationship exists with the source or target of every other link.
      const current = links[i];
      if (visited.has(current)) continue; // optimization
      if (
        // going through links, if the source or target is the current officer, we'll process that officer too.
        current.source === link.source ||
        current.source === link.target ||
        current.target === link.source ||
        current.target === link.target
      ) {
        queue.push(current);
      }
    }
  }

  const nodesByOfficer = nodes.filter((n) => n.unique_mos_id in allIds);
  return { nodes: nodesByOfficer, links: linksByOfficer };
}

module.exports = { build, buildLinks, buildNodes, makeGraphForSingleOfficer };
