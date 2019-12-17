class VM {
  constructor(program, base = 0, i = 0) {
    this.data = [...program];
    this.base = base;
    this.i = i;
  }

  getPosition(mode = "0", index) {
    switch (mode) {
      case "0":
        return this.data[index];
      case "1":
        return index;
      case "2":
        return this.data[index] + this.base;
    }
  }

  getValue(mode = "0", index) {
    return this.data[this.getPosition(mode, index)];
  }

  setInput(input) {
    this.data[0] = input;
  }

  clone() {
    return new VM(this.data, this.base, this.i);
  }

  *run() {
    while (this.i < this.data.length) {
      const operation = String(this.data[this.i]);
      const code = parseInt(operation.slice(-2), 10);
      const modes = operation
        .slice(0, -2)
        .split("")
        .reverse();

      const p0 = this.getValue(modes[0], this.i + 1);
      const pos0 = this.getPosition(modes[0], this.i + 1);
      const p1 = this.getValue(modes[1], this.i + 2);
      const pos1 = this.getPosition(modes[1], this.i + 2);
      const p2 = this.getValue(modes[2], this.i + 3);
      const pos2 = this.getPosition(modes[2], this.i + 3);

      switch (code) {
        case 1: {
          this.data[pos2] = p0 + p1;
          this.i += 4;
          break;
        }

        case 2: {
          this.data[pos2] = p0 * p1;
          this.i += 4;
          break;
        }

        case 3: {
          this.data[pos0] = yield { type: "i" };
          this.i += 2;
          break;
        }

        case 4: {
          yield { type: "o", val: p0 };
          this.i += 2;
          break;
        }

        case 5: {
          this.i = p0 ? p1 : this.i + 3;
          break;
        }

        case 6: {
          this.i = p0 ? this.i + 3 : p1;
          break;
        }

        case 7: {
          this.data[pos2] = p0 < p1 ? 1 : 0;
          this.i += 4;
          break;
        }

        case 8: {
          this.data[pos2] = p0 === p1 ? 1 : 0;
          this.i += 4;
          break;
        }

        case 9: {
          this.base += p0;
          this.i += 2;
          break;
        }

        case 99: {
          return;
        }
      }
    }

    throw new Error("There is no output signal");
  }
}

module.exports = VM;
