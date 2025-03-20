export const Types: { [key: string]: string } = {
    C: 'Color',
    W: 'Width',
    B: 'Bag size',
    M:'Micron',
    Y:'Yarn',
}


export const TypesLabel = (value: string | null) => {
    if(value)
    return Types[value] || 'Unknown';
};


export const Machines : {[key:string]:string} = {
    C:'Clipping Machine',
    E:'Extrusion Machine',
    K:'Knitting Machine'
}
export const MachineNames = (value: string | null) => {
    if(value)
    return Machines[value] || 'Unknown';
};


type machinekeys =keyof typeof Machines

export const relatedTypesLabel: {
    [key in machinekeys]: machinekeys[];
} = {
    E: ['C','W','M'],
    C: ['B' ,'C'],
    K :['Y' ,'C']
    
};

export const procurementUnits: { [key: string]: string } = {
    P: 'Piece',
    K: 'Kg',
}
export const consumptionUnits: { [key: string]: string } = {
    ...procurementUnits,
    G: 'Grams',
    MG: 'Milligrams',
    L: 'Liter',
    ML: 'Milliliter',
    M: 'Meter',
    CM: 'Centimeter',
};

type ConsumptionUnitKeys = keyof typeof consumptionUnits;

export const relatedUnits: {
    [key in ConsumptionUnitKeys]: ConsumptionUnitKeys[];
} = {
    P: ['P'],
    B : ['B', 'P'],
    // K: ['K', 'G','MG','P'],
    K: ['K' ,'G'],
    G: ['K' , 'G', 'MG' ],
    MG : ['K' , 'G', 'MG'],
    L: ['L', 'ML'],
    ML: ['ML', 'L'],
    M: ['M', 'CM'],
    CM: ['CM', 'M'],
};

export function getRelatedUnits(unit: ConsumptionUnitKeys) {
    const related = relatedUnits[unit];
    const result: { [key: string]: string } = {};
    related?.forEach((relUnit) => {
        result[relUnit] = consumptionUnits[relUnit];
    });
    return result;
}

export const getConsumptionUnitLabel = (value: string | null) => {
    if(value)
    return consumptionUnits[value] || 'Unknown';
};

export const VendorType = [
    {
        key: 'P',
        value: 'Procurement',
    },
    {
        key: 'S',
        value: 'Sales',
    },
];




