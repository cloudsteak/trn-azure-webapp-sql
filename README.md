# WebApp + SQL adatbázis - Azure

## 1. Adatbázis létrehozás

1. Jelentkezz be az [Azure Portál-ra](https://portal.azure.com/)
2. Menj a piactérre és keress rá a `SQL Database` kifejezésre
3. A találatok közül válaszd ki [`SQL Database`](https://portal.azure.com/#create/Microsoft.SQLDatabase) elemet.
4. Add meg az adatbázis adatait:
   - Előfizetés
   - Erőforráscsoport: `adatbazisok`
   - Adatbázis neve: `webshop`
   - Kiszolgáló - itt hozzunk létre egy újat.
     - Kiszolgálónév (egyedinek kell lennie): `trn-azure-sql-01`
     - Hely: `north-europe`
     - Hitelesítési mód: `SQL- és Azure Active Directory-hitelesítés használata`
     - Azure AD rendszergazda beállításánál válasszuk ki a felhasználónkat
     - Kiszolgáló rendszergazdájának felhasználóneve: `adatgazda`
     - Jelszónál generáljunk valami erős jelszót [itt](https://delinea.com/resources/password-generator-it-tool).
   - Szeretne rugalmas SQL-készletet használni?: `Nem`
   - Számítási feladat környezete: `Fejlesztés`
5. `Következő: Hálózatkezelés >`
6. Hálózati beállítások
   - Csatlakozási módszer: `Nyilvános végpont`
   - Tűzfalszabályok:
     - A kiszolgáló elérésének engedélyezése az Azure-szolgáltatások és -erőforrások számára: `Igen`
     - Jelenlegi ügyféloldali IP-cím hozzáadása: `Igen`
7. `Következő: Biztonság >`
8. `Következő: További beállítások >`
9. `Következő: Címkék >`
10. `Következő: Felülvizsgálat + létrehozás >`
11. `Létrehozás`
12. Megvárjuk, amíg az adatbázis létrejön

## 2. Adatstruktúra létrehozása

Telepítsd az [Azure Data Studio-t](https://learn.microsoft.com/en-gb/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16&tabs=redhat-install%2Credhat-uninstall#download-azure-data-studio)

Nyissuk meg és jelentkezzünk be. Ehhez szükségünk lesz az adatbázis szerver adataira. Ezt a portálon, az adatbázis tulajdonságai alatt találjuk.
(Kiszolgálónév, Kiszolgáló rendszergazdájának felhasználóneve, és a jelszó amit megadtunk a létrehozáskor)

Ha bejelentkeztünk, futtassuk le a `webshop` adatbázison a következő scripteket

### Adat táblák létrehozása

```sql
CREATE TABLE dbo.ProductCategory
(
[productcategoryid] int PRIMARY KEY IDENTITY(1, 1),
[name] varchar(30) NOT NULL,
)

CREATE TABLE dbo.Product
(
[productid] int PRIMARY KEY IDENTITY(1, 1),
[name] varchar(100) NOT NULL,
[productcategoryid] int,
)
```

### Adatok létrehozása a `ProductCategory` táblában

```sql
INSERT INTO dbo.ProductCategory(name)
VALUES ('Szoftver')

INSERT INTO dbo.ProductCategory(name)
VALUES ('Hardver')
```

### Adatok létrehozása a `Product` táblában

```sql
INSERT INTO dbo.Product(productcategoryid, name)
VALUES (1, 'Windows 11')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (1, 'Windows 10')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (1, 'MacOS 13')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (1, 'Ubuntu 22.04')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (2, 'Dell 14" notebook')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (2, 'HP 14" notebook')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (2, 'MacBook Air M2')

INSERT INTO dbo.Product(productcategoryid, name)
VALUES (2, 'MacBook Pro M2 Pro')
```

## 3. Webalkalmazás futtatása - helyileg

1. Függőségek telepítése: `npm install`
2. Alkalmazás futtatása: `DEBUG=trn-azure-webapp-sql:* npm start`
3. Ellenőrzés. Böngészőben nyissuk meg a http://localhost:8080 linket

## 4. Webalkalmazás futtatása - Azure

1. Jelentkezz be az [Azure Portál-ra](https://portal.azure.com/)
2. Menj a piactérre és keress rá a `Webalkalmazás` kifejezésre
3. A találatok közül válaszd ki [`Webalkalmazás`](https://portal.azure.com/#create/Microsoft.WebSite) elemet.
4. Add meg az webalkalmazás adatait:
   - Előfizetés
   - Erőforráscsoport: `webalkalmazasok`
   - Név (Egyedinek kell lennie): `mywebshop`
   - Közzététel: `Kód`
   - Futtatókötnyezet verme: `Node 18 LTS`
   - Operációs rendszer: `Linux`
   - Régió: `north-europe`
   - Linux-csomagnál válasszunk egy létezőt vagy hozzunk létre újat
5. `Következő: Üzembe helyezés >`
6. Folyamatos üzembe helyezés: `Engedélyezés`
7. GitHub-fiók esetén csatlakozzunk a GitHub-hoz és válasszuk a kód fiókját.
8. Adattár: `trn-azure-webapp-sql`
9. Ág: `main`
10. `Következő: Hálózat >`
11. `Következő: Figyelés >`
12. `Következő: Címkék >`
13. `Következő: Felülvizsgálat + létrehozás >`
14. `Létrehozás`
15. Megvárjuk, amíg a webalkalmazás létrejön és a kód felolvasásra kerül. (Ez utóbbit az `Üzembe helyezési központban láthatjuk majd`)
16. Tesztelés: `https://<webalkalmazásom neve>.azurewebsites.net`

## 5. SQL kapcsolat beállítása a Webalkalmazásban

1. Jelentkezz be az [Azure Portál-ra](https://portal.azure.com/)
2. Nyisd meg a webalkalmatásod beállításait
3. Menj be a `Konfiguráció` menüpontba
4. `Alkalmazásbeállítások` alatt hozd létre az alábbi elemeket az `Új alkalmazásbeállítás` gombra kattintva

| Név         | Érték                                              |
| ----------- | -------------------------------------------------- |
| DB_USER     | adatgazda                                          |
| DB_PASSWORD | <jelszó amit az adatbázis felhasználóhoz megadtál> |
| DB_SERVER   | <SQL szerver kiszolgálóneve>                       |
| DB_NAME     | webshop                                            |
| DB_PORT     | 1433                                               |

5. Mentés

## 6. Alkalmazás tesztelése

https://<webalkalmazásom neve>.azurewebsites.net
