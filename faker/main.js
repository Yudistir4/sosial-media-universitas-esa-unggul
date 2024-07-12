const axios = require('axios');
const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  // baseURL: 'https://esgul-sosmed.onrender.com/api/v1',
});
const { fakerID_ID: faker } = require('@faker-js/faker');
const organizations = require('./data/organization.js').organizations;
// const facultys = require('./data/facultysAndProdi.js').facultys;
const facultys = require('./data/facultysAndProdiAndMahasiswa.js').facultys;
let jumlahGagal = 0;

client.interceptors.request.use(
  async (config) => {
    if (!config.headers['Authorization']) {
      config.headers[
        'Authorization'
      ] = `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTUzMDcyNjYsInVzZXJfaWQiOiJkZWNjMWFhYS0wNGUxLTRmZjctODA5Yi05YTdlYjNhNmY5YzAiLCJ1c2VyX3R5cGUiOiJ1bml2ZXJzaXR5In0.-2YToxvf8wksye_k3lcWT7xrpkDPO4zP_VqHv5Ycvd8'}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const login = async () => {
  const data = { email: 'esaunggul@mail.com', password: '12345678' };
  try {
    const res = await client.post('/auths/login', data);
    console.log(res.data.data.access_token);
    return res.data.data.access_token;
  } catch (error) {
    console.log('error');
  }
};

const addOrganization = async () => {
  for (const { email, name } of organizations) {
    await delayedAction();
    try {
      const data = {
        name,
        email,
        user_type: 'organization',
      };
      const res = await client.post('/users', data);
    } catch (error) {
      await delayedAction(3000);
      console.log('error', error?.response?.data);
    }
  }
};
const addFacultys = async () => {
  const startTime = performance.now();
  for (const { email, name, study_programs } of facultys) {
    console.log('---' + name + '---');
    await delayedAction();
    try {
      const data = {
        name,
        email,
        user_type: 'faculty',
      };
      const res = await client.post('/users', data);
      console.log(res.data.data.id);
      const facultyID = res.data.data.id;
      // const facultyID = 'res.data.data.id';

      for (const prodi of study_programs) {
        try {
          console.log(prodi.name);
          await delayedAction();
          const data = {
            name: prodi.name,
            faculty_id: facultyID,
          };
          const result = await client.post('/studyprograms', data);
          const prodi_id = result.data.data.id;
          // const prodi_id = 'result.data.data.id';
          if (prodi.mahasiswa.length === 0) {
            for (let i = 0; i < 20; i++) {
              await delayedAction();
              addStudent(facultyID, prodi_id);
            }
            for (let i = 0; i < 10; i++) {
              addLecturer(facultyID, prodi_id);
            }
          } else {
            for (mahasiswa of prodi.mahasiswa) {
              await delayedAction();
              addStudentWithData(facultyID, prodi_id, mahasiswa);
            }
            for (let i = 0; i < 10; i++) {
              addLecturer(facultyID, prodi_id);
            }
          }
        } catch (error) {
          console.log('error create prodi ' + prodi.name);
        }
      }
    } catch (error) {
      console.log('error create faculty ' + name);
      // console.log('error', error);
    }
  }

  const endTime = performance.now();

  // Calculate execution time in milliseconds
  const executionTime = endTime - startTime;
  console.log({ jumlahGagal });
  console.log(`Execution time: ${executionTime.toFixed(2)} milliseconds`);
  return 'ok';
};

const addStudent = async (faculty_id, study_program_id) => {
  try {
    const name = faker.person.fullName();
    const data = {
      name,
      email: name.replace(/\s+/g, '').toLowerCase() + '@mail.com',
      user_type: 'student',
      nim: faker.number.int().toString(),
      year: 2020,
      is_graduated: false,
      campus_location: 'jakarta',
      faculty_id,
      study_program_id,
    };

    const res = await client.post('/users', data);
    console.log('create student success');
  } catch (error) {
    jumlahGagal++;
    await delayedAction(3000);
    console.log('error create student', error?.response?.data);
  }
};
const addStudentWithData = async (faculty_id, study_program_id, mahasiswa) => {
  try {
    const name = mahasiswa.name
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const data = {
      name,
      email: name.replace(/\s+/g, '').toLowerCase() + '@mail.com',
      user_type: 'student',
      nim: mahasiswa.nim,
      year: parseInt(mahasiswa.nim.substring(0, 4)),
      is_graduated: false,
      campus_location: mahasiswa.campus_location.toLowerCase(),
      faculty_id,
      study_program_id,
    };

    const res = await client.post('/users', data);
    console.log('create student success');
  } catch (error) {
    jumlahGagal++;
    await delayedAction(3000);
    console.log('error create student with data: ', error?.response?.data);
  }
};
const addLecturer = async (faculty_id, study_program_id) => {
  try {
    const name = faker.person.fullName();
    const data = {
      name,
      email: name.replace(/\s+/g, '').toLowerCase() + '@mail.com',
      user_type: 'lecturer',
      nidn: faker.number.int().toString(),
      faculty_id,
      study_program_id,
    };
    const res = await client.post('/users', data);
    console.log('create student success');
  } catch (error) {
    jumlahGagal++;
    await delayedAction(3000);

    console.log('error create lecturer', error?.response?.data);
  }
};

const main = async () => {
  // login();
  addOrganization();
  addFacultys();
  // addStudent();
};

main();

async function delayedAction(time = 40) {
  // Simulate an asynchronous operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
