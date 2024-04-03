const data = {
    columns: [
      {
        label: 'Name',
        field: 'name'
      },
      'Position',
      'Office',
      'Age',
      'Start date',
      'Salary',
    ],
    rows: [
      ["10-09-2023", "pizza", "45000", "25000"],
      ["10-09-2024", "aloo", "45000", "25000"]
    ],
  };
  
  const instance = new mdb.Datatable(document.getElementById('datatable'), data)
  
  document.getElementById('datatable-search-input').addEventListener('input', (e) => {
    instance.search(e.target.value);
  });