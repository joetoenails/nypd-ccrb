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

export const parseComplaintantInfo = ({
  complainant_ethnicity,
  complainant_gender,
  complainant_age_incident,
}) => {
  if (
    !complainant_ethnicity &&
    !complainant_gender &&
    !complainant_age_incident
  )
    return 'Unknown';
  let str = '';
  if (!complainant_ethnicity || complainant_ethnicity === 'Unknown') {
    str += 'Unknown Ethnicity ';
  } else {
    str += complainant_ethnicity + ' ';
  }
  if (!complainant_gender) {
    str += 'Unknown Gender. ';
  } else {
    str += complainant_gender + '. ';
  }

  if (!complainant_age_incident) {
    str += 'Unknown Age';
  } else {
    str += `${complainant_age_incident} years old.`;
  }

  return str;
};
