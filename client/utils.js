export const toggleFilter = (category, type, state, stateSet) => {
  if (state[category] === type) {
    stateSet({ [category]: 'all' });
  } else {
    stateSet({ [category]: type });
  }
};

export const compileComplaints = (allegations) => {
  return allegations.reduce((allComplaints, allegation) => {
    if (allegation.complaint_id in allComplaints) {
      allComplaints[allegation.complaint_id].push(allegation);
    } else {
      allComplaints[allegation.complaint_id] = [allegation];
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

export const parseComplaintantInfo = (allegation, isComplainant = true) => {
  let copOrComplainant = 'complainant';
  if (!isComplainant) copOrComplainant = 'mos';
  const {
    [`${copOrComplainant}_ethnicity`]: ethnicity,
    [`${copOrComplainant}_gender`]: gender,
    [`${copOrComplainant}_age_incident`]: age,
  } = allegation;
  if (!ethnicity && !gender && !age) return 'Unknown';
  let str = '';
  if (!ethnicity || ethnicity === 'Unknown') {
    str += 'Unknown Ethnicity ';
  } else {
    str += ethnicity + ' ';
  }
  if (!gender) {
    str += 'Unknown Gender, ';
  } else {
    if (gender === 'M') {
      str += 'male, ';
    } else if (gender === 'F') {
      str += 'female, ';
    } else {
      str += gender + ', ';
    }
  }

  if (!age) {
    str += 'Unknown Age';
  } else {
    str += `${age} years old`;
  }

  return str;
};
