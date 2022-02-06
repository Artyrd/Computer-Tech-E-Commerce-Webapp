/**
 * Returns a list of dictionaries, each entry are the current catagories 
 * currently available on StarGate
 * 
 * @returns CategoryOptions
 */

function CategoryOptions() {
    // Options for product categories
    // Products must fall under one of these categories
    return(
        [
            {value: 'cpu', label: 'CPU'},
            {value: 'cables', label: 'Cables'},
            {value: 'cooling', label: 'Cooling'},
            {value: 'gpu', label: 'GPU'},
            {value: 'storage', label: 'Storage'},
            {value: 'memory', label: 'Memory'},
            {value: 'motherboard', label: 'Motherboard'},
            {value: 'psu', label: 'PSU'},
            {value: 'case', label: 'Case'},
            {value: 'monitor', label: 'Monitor'},
            {value: 'mice', label: 'Mice'},
            {value: 'keyboard', label: 'Keyboard'},
            {value: 'peripherals', label: 'Peripherals'},
        ]
    )
}

export default CategoryOptions;