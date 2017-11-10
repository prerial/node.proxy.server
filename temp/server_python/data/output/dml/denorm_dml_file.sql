insert into table EMPLOYEES
select employees.employeeid
      ,employees.lastname
      ,employees.firstname
      ,employees.title
      ,employees.titleofcourtesy
      ,employees.birthdate
      ,employees.hiredate
      ,employees.address
      ,employees.city
      ,employees.region
      ,employees.postalcode
      ,employees.country
      ,employees.homephone
      ,employees.extension
      ,employees.photo
      ,employees.notes
      ,employees.reportsto
      ,employees.photopath
      ,employees.salary
      ,employeeterritories.territoryid
      ,territories.territorydescription
      ,territories.regionid
      ,region.regiondescription
from  northwind.employees, northwind.employeeterritories, northwind.territories, northwind.region
where employeeterritories.employeeid = employees.employeeid
and   employeeterritories.territoryid = territories.territoryid
and   territories.regionid = region.regionid; 
 
insert into table CUSTOMERS
select customers.customerid
      ,customers.companyname
      ,customers.contactname
      ,customers.contacttitle
      ,customers.address
      ,customers.city
      ,customers.region
      ,customers.postalcode
      ,customers.country
      ,customers.phone
      ,customers.fax
      ,customercustomerdemo.customertypeid
      ,customerdemographics.customerdesc
from  northwind.customers, northwind.customercustomerdemo, northwind.customerdemographics
where customercustomerdemo.customerid = customers.customerid
and   customercustomerdemo.customertypeid = customerdemographics.customertypeid; 
 
insert into table ORDERS
select orders.orderid
      ,orders.customerid
      ,orders.employeeid
      ,orders.orderdate
      ,orders.requireddate
      ,orders.shippeddate
      ,orders.shipvia
      ,orders.freight
      ,orders.shipname
      ,orders.shipaddress
      ,orders.shipcity
      ,orders.shipregion
      ,orders.shippostalcode
      ,orders.shipcountry
      ,shippers.shipperid
      ,shippers.companyname
      ,shippers.phone
      ,orderdetails.productid
      ,orderdetails.unitprice
      ,orderdetails.quantity
      ,orderdetails.discount
      ,products.productname
      ,products.supplierid
      ,products.categoryid
      ,products.quantityperunit
      ,products.unitprice
      ,products.unitsinstock
      ,products.unitsonorder
      ,products.reorderlevel
      ,products.discontinued
      ,suppliers.companyname
      ,suppliers.contactname
      ,suppliers.contacttitle
      ,suppliers.address
      ,suppliers.city
      ,suppliers.region
      ,suppliers.postalcode
      ,suppliers.country
      ,suppliers.phone
      ,suppliers.fax
      ,suppliers.homepage
      ,categories.categoryname
      ,categories.description
      ,categories.picture
from  northwind.orders, northwind.shippers, northwind.orderdetails, northwind.products, northwind.suppliers, northwind.categories
where orders.shipvia = shippers.shipperid
and   orderdetails.orderid = orders.orderid
and   orderdetails.productid = products.productid
and   products.supplierid = suppliers.supplierid
and   products.categoryid = categories.categoryid; 
 
