
var staffList = [];

function createStaff() {
  if (!validateForm()) return;
  var id = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var dow = document.getElementById("datepicker").value;
  var salary = parseInt(document.getElementById("luongCB").value);
  var position = document.getElementById("chucvu").value;
  var how = document.getElementById("gioLam").value;

  // check trùng id
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].staffId === id) {
      alert("Id đã tồn tại!");
      return;
    }
  }
  // Tạo đối tượng nhân viên
  var staff = new Staff(
    id,
    fullName,
    email,
    password,
    dow,
    salary,
    position,
    how
  );
  staffList.push(staff);
  renderStaff();
  saveLocalStorage();
}

function renderStaff(data) {
  if (!data) data = staffList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
        <td> ${data[i].staffId}</td>
        <td> ${data[i].fullName}</td>
        <td> ${data[i].email}</td>
        <td> ${data[i].dow}</td>
        <td> ${data[i].position}</td>
        <td> ${data[i].totalSalary()}</td>
        <td> ${data[i].xepLoai()}</td>
        <td>
        <button 
        onclick="deleteStaff('${data[i].staffId}')"
        class="btn btn-danger">Del</button>

        <button 
        type="button" 
        data-toggle="modal"
        data-target="#myModal"
        onclick="getUpdateStaff('${data[i].staffId}')"
        class="btn btn-info">Edit</button>
         </td>
        </tr>`;
    document.getElementById("form").reset();
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}
function saveLocalStorage() {
  // chuyển staffList thành chuỗi JSON
  var staffListJson = JSON.stringify(staffList);
  localStorage.setItem("SL", staffListJson);
  console.log(staffListJson);
}
function getStaffList() {
  var staffListJson = localStorage.getItem("SL");
  if (!staffListJson) return [];
  return JSON.parse(staffListJson);
}
function mapStaffList(local) {
  var result = [];

  for (var i = 0; i < local.length; i++) {
    var oldStaff = local[i];
    var newStaff = new Staff(
      oldStaff.staffId,
      oldStaff.fullName,
      oldStaff.email,
      oldStaff.password,
      oldStaff.dow,
      oldStaff.salary,
      oldStaff.position,
      oldStaff.how
    );
    result.push(newStaff);
  }

  return result;
}

function deleteStaff(id) {
  var index = findById(id); 
  if (index === -1) {
    return alert("Id không tồn tại!");
  }
  staffList.splice(index, 1); //tìm thấy thì xóa 1 phần tử trong mảng
  renderStaff();
  saveLocalStorage(); // Lưu mảng mới xuống Local
}

function getUpdateStaff(id) {
  var index = findById(id);
  if (index === -1) return alert("Id không tồn tại!");
  var staff = staffList[index];

  document.getElementById("tknv").value = staff.staffId;
  document.getElementById("name").value = staff.fullName;
  document.getElementById("email").value = staff.email;
  document.getElementById("password").value = staff.password;
  document.getElementById("datepicker").value = staff.dow;
  document.getElementById("luongCB").value = staff.salary;
  document.getElementById("chucvu").value = staff.position;
  document.getElementById("gioLam").value = staff.how;

  document.getElementById("tknv").disabled = true;
}

function updateStaff() {
  if (!validateForm()) return;
  // 1.DOM lấy inputs từ createStaff
  var id = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var dow = document.getElementById("datepicker").value;
  var salary = parseInt(document.getElementById("luongCB").value);
  var position = document.getElementById("chucvu").value;
  var how = document.getElementById("gioLam").value;
  var index = findById(id);
  var staff = staffList[index]; //nhân viên đang muốn sửa

  staff.fullName = fullName;
  staff.password = password;
  staff.email = email;
  staff.dow = dow;
  staff.salary = salary;
  staff.position = position;
  staff.how = how;

  document.getElementById("form").reset();
  document.getElementById("tknv").disabled = false;
  renderStaff();
  saveLocalStorage();
}

function searchStaff(e) {
  var keyword = e.target.value.toLowerCase().trim(); 
  var result = [];
  for (var i = 0; i < staffList.length; i++) {
    var staffId = staffList[i].staffId;
    var staffFullName = staffList[i].fullName.toLowerCase();
    if (staffId === keyword || staffFullName.includes(keyword)) {
      result.push(staffList[i]);
    }
  }
  renderStaff(result);
}

function searchTypeStaff(e) {
  var keyword = e.target.value.toLowerCase().trim();
  var result=[];
  for (var i=0; i< staffList.length; i++) {
    var staffType = staffList[i].xepLoai().toLowerCase();
    if (staffType ===keyword || staffType.includes(keyword)) {
  result.push(staffList[i]);
    }
  }
  renderStaff(result);
  }

function findById(id) {
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].staffId === id) {
      return i;
    }
  }
  return -1;
}
window.onload = function () {
  var staffListFromLocal = getStaffList(); 
  staffList = mapStaffList(staffListFromLocal);
  renderStaff();
};

// check min & max length
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(
      config.errorCode
    ).innerHTML = `*Độ dài phải từ ${config.min} đến ${config.max} ký tự`;
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  }
  document.getElementById(config.errorCode).innerHTML = "";
  return true;
}

function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "* Vui lòng nhập giá trị!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}
// Pattern Name
function patternName(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Tên không được có số hoặc ký tự đặc biệt";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// Pattern mail
function patternEmail(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML = "*Email không hợp lệ!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// Pattern password
function patternpassword(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// Pattern day of work
function patternDow(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Nhập vào theo định dạng mm/dd/yy!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// Pattern salary
function patternSalary(val, config) {
  if (val * 1 < config.min || val * 1 > config.max) {
    document.getElementById(config.errorCode).innerHTML =
      "*Lương từ 1,000,000 đến 20,000,000!";
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  } else {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
}
// pattern Position
function patternPosition(config) {
  if (document.getElementById("default").selected === true) {
    document.getElementById(config.errorCode).innerHTML = "*Chọn vị trí!";
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  } else {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
}

// Pattern hour of work
function patternHow(val, config) {
  if (val * 1 < config.min || val * 1 > config.max) {
    document.getElementById(config.errorCode).innerHTML =
      "*Số giờ làm từ 80 đến 200 giờ!";
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  } else {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
}

function validateForm() {
  var staffId = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var dow = document.getElementById("datepicker").value;
  var salary = document.getElementById("luongCB").value;
  var how = document.getElementById("gioLam").value;

  var staffIdValid =
    required(staffId, { errorCode: "tbTKNV" }) &&
    length(staffId, { errorCode: "tbTKNV", min: 4, max: 6 });
  var fullNameValid =
    required(fullName, { errorCode: "tbTen" }) &&
    patternName(fullName, {
      errorCode: "tbTen",
      regexp:
        /^[A-zaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]+$/g,
    });

  var emailValid =
    required(email, { errorCode: "tbEmail" }) &&
    patternEmail(email, {
      errorCode: "tbEmail",
      regexp: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    });

  var passwordValid =
    required(password, { errorCode: "tbMatKhau" }) &&
    patternpassword(password, {
      errorCode: "tbMatKhau",
      regexp: /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{6,10}$/g,
    });
    

  var dowValid =
    required(dow, { errorCode: "tbNgay" }) &&
    patternDow(dow, {
      errorCode: "tbNgay",
      regexp: /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/][0-9]{4})$/g,
    });

  var salaryValid =
    required(salary, { errorCode: "tbLuongCB" }) &&
    patternSalary(salary, {
      errorCode: "tbLuongCB",
      min: 1000000,
      max: 20000000,
    });

  var positionValid = patternPosition({ errorCode: "tbChucVu" });

  var howValid =
  required(how, { errorCode: "tbGiolam"}) &&
  patternHow(how, {
    errorCode: "tbGiolam",
    min: 80,
    max: 200,
  });

  var isFormValid =
    staffIdValid &&
    fullNameValid &&
    emailValid &&
    passwordValid &&
    dowValid &&
    salaryValid &&
    positionValid &&
    howValid;

  return isFormValid;
}
