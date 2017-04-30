// @flow

const demo = () => {
    class Unused {
        text: string;

        constructor() {
            this.text = "Demo!";
        }

        method() {
            return Object.assign({}, {
                demo: this.text
            });
        }
    }
    const instance = new Unused();

    return instance.method();
};

function foo(x: ?number): string {
    if (x) {
        return x.toString();
    }
    return "default string";
}

foo(1);

export default demo;
