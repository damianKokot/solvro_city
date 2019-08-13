class priorityQueue{
    constructor(compareTable){
        this.data = new Array(1);
        this.length = 0;
    }
    //Returns element on the top of heap
    top() {
        if (this.length > 0)
            return this.data[1];
        else
            return null;
    }
    //Add element to queue
    push(element) {
        //If there is no more memory left, add some free space
        if (this.length === this.data.length - 1) 
            this.data = this.data.concat(new Array(this.data.length));
        
        this.length++;
        this.data[this.length] = element;
        this.upheap(this.length);
    }
    //Delete element on top
    pop() {
        this.data[1] = this.data[this.length];
        this.data[this.length] = 0
        this.length--;
        this.downheap(1);
    }
    //Returns true if queue is empty
    empty() {
        return this.length === 0;
    }

    //Returns parent of node
    parent(index) {
        return Math.floor(index / 2);
    }
    //Returns index of son with higher priority
    minSon(index) {
        const left = this.leftSon(index);
        const right = this.rightSon(index);

        if (left && right) {
            if (this.compare(left, right))
                return 2 * index;
            else
                return 2 * index + 1;
        } else if (!left && right) {
            return 2 * index + 1;
        } else if (!right && left) {
            return 2 * index;
        } else {
            return null;
        }
    }
    //Return left son of node if exist
    leftSon(index) {
        if (index * 2 <= this.length) {
            return this.data[index * 2];
        } else {
            return null;
        }
    }
    //Return right son of node if exist
    rightSon(index) {
        if (index * 2 + 1 <= this.length) {
            return this.data[index * 2 + 1];
        } else {
            return null;
        }
    }

    //Reorder heap from down to up
    upheap(index) {
        while (index !== 1 && this.compare(this.data[index], this.data[this.parent(index)])) {
            this.swap(index, this.parent(index));
            index = this.parent(index);
        }
    }
    //Reorder heap from up to down 
    downheap(index) {
        while (index <= this.length) {
            let swapIndex = this.minSon(index);

            if (swapIndex !== null && this.compare(this.data[swapIndex], this.data[index])) {
                this.swap(index, swapIndex);
            } else {
                break;
            }
            index = swapIndex;
        }
    }
    //Compare two elements
    compare(a, b) {
        return a < b;
    }
    //Swap two variables in array
    swap(_index1, _index2) {
        const tmp = this.data[_index1];
        this.data[_index1] = this.data[_index2];
        this.data[_index2] = tmp;
    }
}
module.exports = {
    priorityQueue: priorityQueue
}