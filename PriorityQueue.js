class priorityQueue {
    constructor() {
        this.root = null;
    }
    push(element) {
        if (this.root) {
            var node = this.root;
            while (true) {
                if (this.compare(node.item, element)) {
                    if (node.right) {
                        node = node.right;
                    } else {
                        node.right = { item: element };
                        break;
                    }
                } else {
                    if (node.left) {
                        node = node.left;
                    } else {
                        node.left = { item: element };
                        break;
                    }
                }
            }
        } else {
            this.root = { item: element };
        }
    };
    pop() {
        var node = this.root;
        var father = null;
        //Idziemy do najwyższego stopniem wierzchołka
        while (node.right) {
            father = node;
            node = node.right;
        }
        
        if (father === null) {
            //Jeżeli root to najwyższy wierzchołek wtedy bierzemy prawego syna (lub null);
            this.root = node.left;
        } else {
            //Jeżeli najwyższy wierzchołek ma syna, to dopisujemy go ojcu
            father.right = node.left;
        }
        return node.item;
    };
    empty() {
        return this.root == null;
    };
    compare(a, b) {
        return a < b
    };
}

module.exports = {
    priorityQueue: priorityQueue
}