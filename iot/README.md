# 🔌 Conexão entre ESP32 e Módulo RFID-RC522

Abaixo estão os pinos utilizados para conectar o ESP32 ao módulo RFID-RC522 utilizando a interface SPI padrão:

| Pino RFID-RC522 | Pino ESP32 (exemplo) | Função           |
| --------------- | -------------------- | ---------------- |
| VCC             | 3.3V                 | Alimentação      |
| GND             | GND                  | Terra            |
| RST             | GPIO 22              | Reset            |
| SDA (SS)        | GPIO 21              | Chip Select (SS) |
| MOSI            | GPIO 23              | SPI MOSI         |
| MISO            | GPIO 19              | SPI MISO         |
| SCK             | GPIO 18              | SPI Clock        |

💡 Observação: Os GPIOs indicados são apenas exemplos. Você pode alterá-los conforme necessário, desde que ajuste a configuração no código.

# 💻 Exemplo de configuração SPI no código Arduino

```cpp
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN     22     // Reset pin
#define SS_PIN      21     // Chip Select pin

MFRC522 rfid(SS_PIN, RST_PIN); // Cria instância do leitor

void setup() {
  Serial.begin(115200);
  SPI.begin(18, 19, 23);  // SCK, MISO, MOSI
  rfid.PCD_Init();        // Inicializa o módulo
  Serial.println("Aproxime o cartão...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  Serial.print("UID da tag: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();
  delay(1000);
}
````
