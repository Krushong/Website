.PHONY: build run stop restart

# Название образа
IMAGE_NAME = auth-website

# Порт приложения из .env файла (по умолчанию 3000)
PORT ?= 3000

# Остановка контейнера
stop:
	@echo "Останавливаю контейнер..."
	@docker ps | grep $(IMAGE_NAME) | awk '{print $$1}' | xargs -r docker stop

# Сборка образа
build:
	@echo "Собираю Docker образ..."
	@docker build -t $(IMAGE_NAME) .

# Запуск контейнера
run:
	@echo "Запускаю контейнер..."
	@docker run --env-file .env -p $(PORT):$(PORT) $(IMAGE_NAME)

# Перезапуск (остановка + сборка + запуск)
restart: stop build run

# Показать логи контейнера
logs:
	@docker logs $$(docker ps | grep $(IMAGE_NAME) | awk '{print $$1}')

# Очистка неиспользуемых образов и контейнеров
clean:
	@echo "Очищаю неиспользуемые Docker образы и контейнеры..."
	@docker system prune -f

# Помощь
help:
	@echo "Доступные команды:"
	@echo "  make build    - собрать Docker образ"
	@echo "  make run      - запустить контейнер"
	@echo "  make stop     - остановить контейнер"
	@echo "  make restart  - перезапустить контейнер (stop + build + run)"
	@echo "  make logs     - показать логи контейнера"
	@echo "  make clean    - очистить неиспользуемые Docker образы и контейнеры" 