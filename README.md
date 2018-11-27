## JSON зявки за чат ##

Адрес: https://bg.melakit.com/favochat/fc.php
Заявките се изпращат с POST
	   
1. **Държави**
	* mode=country
	
	Връща списък с държави със следната информация: countryCode, countryPhoneCode, countryName, countryFlag, countryCurrent.
	countryCurrent = 1 когато е хванало държавата на потребителя иначе е 0
	   

2. **Регистрация**
	* mode=register
	* country=BG
	* phone=3598888888
	* name=George
	* password=123456
		
	Връща user=1sdd1erfwer (ID на потребителя) и код за валидация code=1234 при успешно записване на днните  
	
	Грешки:
	   
	   Грешките са в масив:
			error.phone = 1 -> невалиден телефон
			error.phone = 2 -> този телефон е вече регистриран
			error.phone = 7 -> телефонът не започва с кода на държавата, която е посочена
			error.country = 6 -> неизвестна държава
			error.password = 8 -> паролата трябва да съдържа между 5 и 20 латински букви и/или цифри	


3. **Проверка на код**
	* mode=checkCode
	* phone=35988888
	* code=1234
	* user=sdf4234sd -> ID на потребителя
	
	Връща checked=1
	
	Грешки:
	   error = 3 -> грешен код
	   error = 9 -> несъществуващ телефон/потребител
	   

4. **Търсене на приятел**	 
	* mode=friendSearch
	* phone=35988888
	* user=sdf4234sd -> потребителя, който прави търсенето
	
	Връща масив с user=sdf4234sd, name=George и avatar=http://ww1.favo360.com/_s/no-image.png
	
	Грешки:
	   error = 1 -> невалиден телефон
	   error = 4 -> несъществуващ телефон/потребител
	   error = 5 -> няма зададен потребител, който прави търсенето или потребител е празно
	   error = 17 -> friendRequest е вече изпратен
	   

5. **Код на държава**
	* mode=getCountry
	
	Връща код на държавата countryCode=BG, countryName=Bulgaria и код countryPhoneCode=359
		
	Грешки: error = 6 -> неизвестна държава
		

6. **Логин**
	* mode=login
	* phone=35988888
	* password=favochat
	
	Връща ID на потребителя user=sdf4234sd
		
	Грешки:	
		error = 10 -> грешен телефон или парола
		error = 11 -> профилът не е активиран - не е потвърден кода за активация
		

7. **Добавяне на приятел**
	* mode=friendRequest
	* user=sdf4234sd -> потребителя, който прави рекуеста
	* userTo=asasf3445 -> потребите към когото е рекуеста
	
	Връща ID на връзката conId
	
	Грешки:	
		error = 12 -> грешен потребител, който прави рекуеста
		error = 13 -> грешен потребител, към който е рекуеста
		error = 14 -> неуспешно създаване на връзката conId
		error = 17 -> friendRequest е вече изпратен
	

8. **Потвърждаване на Friend Request**
	* mode=friendRequestOK
	* user=sdf4234sd -> потребителя, който потвърждава рекуеста	
	* conId=2345tgerter -> връзка, която се потвърждава
	
	Връща confirmed=1 ако потвърждаването е успешно
	
	Грешки:	
		error = 15 -> грешен потребител, който потвърждава рекуеста. Само потребителя към когото е насочен рекуеста може да го повърди.
		error = 16 -> несъществуваща връзка


9. **Списък с приятели**
	* mode=friendsList
	* user=sdf4234sd -> текущият потребител
	
	Връща списък с приятели. Потребител user=23fer, conId=asd32534, име name=George, phone=359999, company=Favo и avatar=http://ww1.favo360.com/_s/no-image.png, accepted=1 (0 -> friend request не е потвърден, 1-> потвърден). 
	Има отделен флаг за потвърждаване и се показва само на потребителя, който трябва да потвърди заявката - confirmRequest=1. 
	
	Грешки
	  error = 4 -> несъществуващ потребител


10. **Записване на нов коментар**
	* mode=commentInsert
	* conId=c4ca4238a0b923820dcc509a6f75849b
	* user=sdf4234sd
	* txt=Some text
	
	Записване на нов коментар от потребител sdf4234sd към връзка c4ca4238a0b923820dcc509a6f75849b
	
	При успешен запис връща ID на коментара и самия коментар като текст
	
	Грешки:
		
		error = 16 -> несъществуваща връзка
		error = 17 -> няма зададен потребител или връзка


11. **Четене на коментари**
	* mode=commentRead
	* conId=c4ca4238a0b923820dcc509a6f75849b
	* user=sdf4234sd
		
	Връща списък с коментари в масив chatList за тази връзка и conId=c4ca4238a0b923820dcc509a6f75849b.
В случая c4ca4238a0b923820dcc509a6f75849b. Списъка съдържа последните 20 коментара в това число ID-та на първия и последния коментар съответно:
	chatOuter.chatIdFirst=sdfwwe534 и chatOuter.chatIdLast=345345sdgd
		
	Допълнителен се връща msgType, като стойността по подразбиране е txt. Други стойности са img и snd. 
	Когато типа на съобщението е различно от текст се връща допълнителен масив с абсолютния път към файла. 
	Ако файловете са картинки и са повече от 1 бр. тогава се връща първата картинка и броят на другите картинки.
	
	Пример: 1. Sound. msgType=snd file=https://bg.melakit.com/favochat/drive/sound.mp3
			2. Image. msgType=img file=https://bg.melakit.com/favochat/drive/image.jpg numImg=2 (2 означава че има още 2 картинки, ако е 0 значи картинката е само една)
	

	При връщане на readNores=1 означава че не са намерени резултати

	Optional:
	Като допълнителни параметри към сървъра може да се изпрати offset=newerThan и offset=olderThan, като те трябва да бъдат придружени от chatId=235sdsd34dfg. 
	Когато не се изпрати chatId сървъра връща по default последните 20 резулата.
	
	Грешки:
		error = 16 -> несъществуваща връзка
		error = 17 -> няма зададен потребител или връзка
	

12. **Изпращане на картинка и звуков файл**
	* mode=fileInsert
	* conId=c4ca4238a0b923820dcc509a6f75849b
	* user=sdf4234sd
	* msgType=snd или img


13. **Recent**
	* mode=chatRecent
	* user=sdf4234sd
	
	Прочитане на скорошни чат сесии и групиране по потребител с показване на последния текст.
	
	Грешки:
	   error = 4 -> несъществуващ потребител
	   error = 18 -> няма скорошни чат сесии
	   error = 19 -> няма приятели


14. **Език**
	* mode=language
	
	Връща списък с възможните езици:
	* langId=BG
	* langName=Български
	* langIcon=https://cdn.melakit.com/flags/64/BG.png


15. **Текстове**
	* mode=texts
	* langId=BG
	
	Връща списък с текстовете използвани в приложението. 
	version=1 -> версията на текстовете
	textsList= array() -> масив със самите текстове
	
	textId=1
	textString=Текст

16. **Аватар**
	* mode=userAvatar
	* user=sdf4234sd
	
	Качване на аватар. Картинката трябва да е JPG. Ако има стар аватар се изтрива и се заменя с качения.

17. **Информация за потребителя**
	* mode=userInfo
	* user=sdf4234sd -> текущият потребител
	* userSrch=sdf4234sd -> потребителя чято информация се извлича
	
	Грешки:
	* error = 4 -> несъществуващ потребител
	* error = 20 -> няма потребител който прави търсенето

18. **Известия**
	* mode=notify
	* user=sdf4234sd -> текущият потребител
        * langId=BG език
	
	Връща readNores = 1 ако няма нотификейшъни. 
	За нови чат съобщения: notifications -> unreadChats = 1, pendingFriendRequests = 0, newsFeed = 0
	
	Ако всички от unreadChats, pendingFriendRequests, newsFeed са = 0 тогава readNores = 1. 
	Ако поне едно е != 0 тогава се връща notifications -> unreadChats = 1, pendingFriendRequests = 0, newsFeed = 0
	
	Грешки:
	error = 4 -> несъществуващ потребител


19. **Временен номер за изпращане на няколко файла**
	* mode=fileInsertTemp
	* conId=c4ca4238a0b923820dcc509a6f75849b
	* user=sdf4234sd
	
	Връща номер за използване при качването на файлове - fileMerge=1010
	
	Грешки:
		error = 16 -> несъществуваща връзка
		error = 17 -> няма зададен потребител или връзка


20. **Регистрация за Push Notifications**
      * mode=pushReg
      * userId=asfasggsasg
      * pushRegId= push token
      * pushService= gcm, apns....

      Връща success=1 ако е успешно

21. **Известия**

	Известията са в обект при получаване на push notification. Обекта е notiMsg и съдържа връзките conId от които има нови съобщения.
	
	
22. **Прочитане на известия (Notifications)** 
	* mode=chatRecentNotify
	* conIdConcat=sdf34234,345sad345
	* user=sdf4234sd
	
	При преглед на известия за чат.

23. **Проверка за регистрация на Favo360**
	* mode=favo360checkPhone
	* phone=35988888888
	
	Връща results = 1 При успешно намиране на профил и 0 при неуспех
	
	Грешки:
		error = 18 -> няма зададен телефон

24. **Създаване на профил**
	* mode=favo360newAccount
	* user=sdf4234sd
	* company=ltd
	* city=213
	* crncyId=USD
	
	Грешки:
	   * error = 2 -> този телефон е вече регистриран
	   * error = 4 -> несъществуващ потребител
	   * error = 21 -> не са подадени всички задължителни полета

25. **Забравена парола**
	* mode=favoChatNewPass
	* phone=35943545
	* langId=BG
	
	* Грешки: error = 22 -> несъствщвуващ телефон

26. **Смяна на парола**
	* mode=newPass
	* user=sdf4234sd
	* password=2423
	* passwordNew=23432
	
	* Грешки:
	* error = 23 -> грешна сегашна парола
	* error = 8 -> паролата трябва да съдържа между 5 и 20 латински букви и/или цифри


////////////////////////////////////////////////////////////////////////////////////////////////

1. Регистриране на потребител на Favo360 -> favo360newAccount. Изисква се следната информация:
	- Име -> взима се от профила и е попълнено
	- Телефон -> взима се от профила и е попълнено
	- Държава -> взима се от профила и е попълнено
	- Град -> заявка cities. Трябва да се подаде държава. Например BG
	- Фирма
	- Валута -> favo360currency
	
При успешна регистрация се връща token който се записва на устройството и след това се използва за изпращане на заявки към сайта - Authorization: sad3sdggdgf....


## /////////////// CORDOVA /////////////// ##

It is strongly encouraged that you restrict access to external resources in your application before releasing to production.

For more information on whitelist configuration, see the [Cordova Whitelist Guide][cordova-whitelist-guide] and the [Cordova Whitelist Plugin documentation][cordova-plugin-whitelist]

## [www/index.html][index-html]

#### Content Security Policy (CSP)

The default CSP is similarly open:

    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *" />

Much like the access tag above, you are strongly encouraged to use a more restrictive CSP in production.

A good starting point declaration might be:

    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: 'unsafe-inline' https://ssl.gstatic.com; style-src 'self' 'unsafe-inline'; media-src *" />

For more information on the Content Security Policy, see the [section on CSP in the Cordova Whitelist Plugin documentation][cordova-plugin-whitelist-csp].

Another good resource for generating a good CSP declaration is [CSP is Awesome][csp-is-awesome]


[phonegap-cli-url]: http://github.com/phonegap/phonegap-cli
[cordova-app]: http://github.com/apache/cordova-app-hello-world
[bithound-img]: https://www.bithound.io/github/phonegap/phonegap-app-hello-world/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/phonegap-app-hello-world
[config-xml]: https://github.com/phonegap/phonegap-template-hello-world/blob/master/config.xml
[index-html]: https://github.com/phonegap/phonegap-template-hello-world/blob/master/www/index.html
[cordova-whitelist-guide]: https://cordova.apache.org/docs/en/dev/guide/appdev/whitelist/index.html
[cordova-plugin-whitelist]: http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist
[cordova-plugin-whitelist-csp]: http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist#content-security-policy
[csp-is-awesome]: http://cspisawesome.com