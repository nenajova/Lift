function calculateStops(buildingArr, liftCapacity) {

    let lift = {
        floor: 0,
        direction: 0,
        passengers: []
    }

    let result = []

    do {

        let liftStoped = false
        let emptyBuilding = true

        switch (lift.direction) {
            case 0:
                for (let i=0; i<buildingArr.length; i++) {
                    if (buildingArr[i].length > 0) {
                        lift.direction = 1
                    }
                }
            break
            case 1:
                let needToUp = false
                if (lift.floor < buildingArr.length-1) { // ako nije na poslednjem spratu
                    for (let i=lift.floor; i<buildingArr.length; i++) { // prolazi kroz sve spratove iznad
                        for (let j=0; j<buildingArr[i].length; j++) { // prolazi kroz sve cekace na spratu
                            if (buildingArr[i][j]>lift.floor || i>lift.floor) { // ako ima putnika koji idu gore ili ima uopste cekaca gore
                                needToUp = true
                                break
                            }
                        }
                    }
                }
                for (let passenger of lift.passengers) { // prolazi kroz sve putnike u liftu
                    if (passenger > lift.floor) { // ako neko ide gore jos
                        needToUp = true
                        break
                    }
                }
                if (!needToUp) lift.direction = -1
            break
            case -1:
                let needToDown = false
                if (lift.floor > 0) { // ako nije u prizemlju
                    for (let i=lift.floor-1; i>0; i--) { // prolazi kroz sve spratove ispod
                        for (const waiter of buildingArr[i]) { // prolazi kroz sve cekace na spratu
                            if (waiter<lift.floor) { // ako ima putnika koji idu gore
                                needToDown = true
                                break
                            }
                        }
                    }
                }
                for (let passenger of lift.passengers) { // prolazi kroz sve putnike u liftu
                    if (passenger < lift.floor) { // ako neko ide gore jos
                        needToDown = true
                        break
                    }
                }
                if (!needToDown || lift.floor>0) lift.direction = -1
            break
        }


        // staje da izadje putnik
        while (lift.passengers.indexOf(lift.floor) !== -1) {
            lift.passengers.splice(lift.passengers.indexOf(lift.floor),1)
            liftStoped = true
        }
        // ljudi ulaze u lift
        let changeIndexes = []
        if (buildingArr[lift.floor] != undefined) {
            for (const [id, passenger] of buildingArr[lift.floor].entries()){
                if (passenger>lift.floor && lift.direction == 1) {
                    changeIndexes.push(id)
                } else if (passenger<lift.floor && lift.direction == -1) {
                    changeIndexes.push(id)
                }
            }
        }
        if (changeIndexes.length > 0) {
            for (const i of changeIndexes.reverse()) {
                if (lift.passengers.length < liftCapacity) {
                    lift.passengers.push(buildingArr[lift.floor][i])
                    buildingArr[lift.floor].splice(i,1)
                }
            }
            liftStoped = true
        }

        // zaustavljanje 
        if (liftStoped || (lift.floor == 0)) {
            result.push(lift.floor)
        }

        // pomeranje lifta
        lift.floor += lift.direction

        // lift staje / zavrsava, nema putnika i u prizemlju je
        if (emptyBuilding && lift.floor == 0) {
            lift.direction = 0
        }
    } while (lift.direction != 0)
    result.push(0)
    return result
}

const buildingArr = [
    [],             // prizemlje
    [3],            //  1
    [4],            //  2
    [],             //  3
    [5,6,2,6],      //  4
    [],             //  5
    []              //  6
]
const liftCapacity = 4

console.log(calculateStops(buildingArr, liftCapacity))