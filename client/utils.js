export const toggleFilter = (category, type, state, stateSet) => {
  if (state[category] === type) {
    stateSet({ [category]: 'all' });
  } else {
    stateSet({ [category]: type });
  }
};

export const compileComplaints = ({ complaints }) => {
  const complaintsById = {};
  complaints.forEach((complaint) => {
    if (complaint.complaintId in complaintsById) {
      complaintsById[complaint.complaintId].push(complaint);
    } else {
      complaintsById[complaint.complaintId] = [complaint];
    }
  });
  return complaintsById;
};
