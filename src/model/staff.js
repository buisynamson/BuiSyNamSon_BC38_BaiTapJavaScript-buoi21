function Staff(id, fullName, email, password, dow, salary, position, how) {
  this.staffId = id;
  this.fullName = fullName;
  this.email = email;
  this.password = password;
  this.dow = dow;
  this.salary = salary;
  this.position = position;
  this.how = how;
  this.totalSalary = function () {
    if (this.position === "Sếp") {
      return this.salary * 3;
    } else if (this.position === "Trưởng phòng") {
      return this.salary * 2;
    } else if (this.position === "Nhân viên") {
      return this.salary;
    }
  };
  this.xepLoai =function() {
    if(this.how >=192) {
      return "Xuất sắc"
    } else if(this.how <=192 && this.how >=176) {
      return "Giỏi"
    } else if(this.how <=176 && this.how >=160) {
      return "Khá"
  } else {
    return "Trung bình"
  }
}
}