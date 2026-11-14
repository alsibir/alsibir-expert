АС «АЛЬФА» — графический демонстрационный кейс

15 иллюстраций одного условного проекта, пояснения и навыки.
Данные синтетические; факт эксплуатации и испытаний не заявляется.

Состав:
  plantuml/ — 15 исходников .puml и общий theme.puml;
  svg/ — 15 скомпилированных изображений SVG;
  alpha-graphic-album.pdf — общий альбом, 16 страниц;
  catalog.json — подписи, пояснения и демонстрируемые навыки.

Исходник theme.puml должен находиться рядом с исходниками UML и ER.
BPMN и отчётная форма используют поддерживаемый PlantUML режим @startdot.
BPMN: обзор процесса; отмена и уточнение раскрыты моделью состояний.
Отчётная форма — предложение, не заявленная функция версии 1.0.0.

Повторная сборка: PlantUML 1.2025.10, Java, Graphviz, DejaVu Sans.
Пример из каталога plantuml:
  java -jar /path/plantuml-1.2025.10.jar -charset UTF-8 -tsvg "??-*.puml"
В репозитории сайта:
  PLANTUML_JAR=/path/plantuml-1.2025.10.jar npm run graphdemo:render
  python3 scripts/package-graphdemo.py
Для PDF: Python reportlab, системные шрифты DejaVu, npm-зависимости проекта.
Скрипт требует доступ к Node.js и Graphviz через PATH.

https://alsibir.github.io/aps-expert/wiki/portfolio/analytics/alpha-graphic-models/
