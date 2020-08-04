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

export const createRandomColorKeyObj = () => {
  const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
  ];
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = colors[i];
    colors[i] = colors[j];
    colors[j] = temp;
  }

  const colorKey = {
    White: '',
    Black: '',
    Asian: '',
    Hispanic: '',
    'American Indian': '',
  };
  let i = 0;
  for (const key in colorKey) {
    colorKey[key] = colors[i];
    i++;
  }
  return colorKey;
};

export const getFadoTypes = (complaints) => {
  const types = {};
};
