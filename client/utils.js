export const toggleFilter = (category, type, state, stateSet) => {
  if (state[category] === type) {
    stateSet({ [category]: 'all' });
  } else {
    stateSet({ [category]: type });
  }
};

export const compileComplaints = (complaints) => {
  return complaints.reduce((allComplaints, complaint) => {
    if (complaint.complaintId in allComplaints) {
      allComplaints[complaint.complaintId].push(complaint);
    } else {
      allComplaints[complaint.complaintId] = [complaint];
    }
    return allComplaints;
  }, {});
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

export const parseComplaintantInfo = ({
  complaintEthnicity,
  complaintGender,
  complaintAge,
}) => {
  if (!complaintEthnicity && !complaintGender && !complaintAge)
    return 'Unknown';
  let str = '';
  if (!complaintEthnicity || complaintEthnicity === 'Unknown') {
    str += 'Unknown Ethnicity ';
  } else {
    str += complaintEthnicity + ' ';
  }
  if (!complaintGender) {
    str += 'Unknown Gender. ';
  } else {
    str += complaintGender + '. ';
  }

  if (!complaintAge) {
    str += 'Unknown Age';
  } else {
    str += `${complaintAge} years old.`;
  }

  return str;
};
