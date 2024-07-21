################################################################################
# Automatically-generated file. Do not edit!
################################################################################

SHELL := cmd.exe
RM := rm -rf

USER_OBJS :=

LIBS := 
PROJ := 

O_SRCS := 
C_SRCS := 
S_SRCS := 
S_UPPER_SRCS := 
OBJ_SRCS := 
ASM_SRCS := 
PREPROCESSING_SRCS := 
OBJS := 
OBJS_AS_ARGS := 
C_DEPS := 
C_DEPS_AS_ARGS := 
EXECUTABLES := 
OUTPUT_FILE_PATH :=
OUTPUT_FILE_PATH_AS_ARGS :=
AVR_APP_PATH :=$$$AVR_APP_PATH$$$
QUOTE := "
ADDITIONAL_DEPENDENCIES:=
OUTPUT_FILE_DEP:=
LIB_DEP:=

# Every subdirectory with source files must be described here
SUBDIRS := 


# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS +=  \
../AquaSift_V0011.cpp \
../as_class.cpp \
../atmega_eeprom.cpp \
../atmega_spi.cpp \
../atmega_twi.cpp \
../atmega_uart.cpp \
../helper.cpp


PREPROCESSING_SRCS += 


ASM_SRCS += 


OBJS +=  \
AquaSift_V0011.o \
as_class.o \
atmega_eeprom.o \
atmega_spi.o \
atmega_twi.o \
atmega_uart.o \
helper.o

OBJS_AS_ARGS +=  \
AquaSift_V0011.o \
as_class.o \
atmega_eeprom.o \
atmega_spi.o \
atmega_twi.o \
atmega_uart.o \
helper.o

C_DEPS +=  \
AquaSift_V0011.d \
as_class.d \
atmega_eeprom.d \
atmega_spi.d \
atmega_twi.d \
atmega_uart.d \
helper.d

C_DEPS_AS_ARGS +=  \
AquaSift_V0011.d \
as_class.d \
atmega_eeprom.d \
atmega_spi.d \
atmega_twi.d \
atmega_uart.d \
helper.d

OUTPUT_FILE_PATH +=AquaSift_V0011.elf

OUTPUT_FILE_PATH_AS_ARGS +=AquaSift_V0011.elf

ADDITIONAL_DEPENDENCIES:=

OUTPUT_FILE_DEP:= ./makedep.mk

LIB_DEP+= 

# AVR32/GNU C Compiler















./%.o: .././%.cpp
	@echo Building file: $<
	@echo Invoking: AVR8/GNU C Compiler : 4.8.1
	$(QUOTE)C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-g++.exe$(QUOTE) -funsigned-char -funsigned-bitfields -DDEBUG  -O1 -ffunction-sections -fdata-sections -fpack-struct -fshort-enums -g2 -Wall -mmcu=atmega328 -c -MD -MP -MF "$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -MT"$(@:%.o=%.o)"   -o "$@" "$<" 
	@echo Finished building: $<
	



# AVR32/GNU Preprocessing Assembler



# AVR32/GNU Assembler




ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

# Add inputs and outputs from these tool invocations to the build variables 

# All Target
all: $(OUTPUT_FILE_PATH) $(ADDITIONAL_DEPENDENCIES)

$(OUTPUT_FILE_PATH): $(OBJS) $(USER_OBJS) $(OUTPUT_FILE_DEP) $(LIB_DEP)
	@echo Building target: $@
	@echo Invoking: AVR8/GNU Linker : 4.8.1
	$(QUOTE)C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-g++.exe$(QUOTE) -o$(OUTPUT_FILE_PATH_AS_ARGS) $(OBJS_AS_ARGS) $(USER_OBJS) $(LIBS) -Wl,-Map="AquaSift_V0011.map" -Wl,--start-group -Wl,-lm  -Wl,--end-group -Wl,--gc-sections -mmcu=atmega328  
	@echo Finished building target: $@
	"C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-objcopy.exe" -O ihex -R .eeprom -R .fuse -R .lock -R .signature -R .user_signatures  "AquaSift_V0011.elf" "AquaSift_V0011.hex"
	"C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-objcopy.exe" -j .eeprom  --set-section-flags=.eeprom=alloc,load --change-section-lma .eeprom=0  --no-change-warnings -O ihex "AquaSift_V0011.elf" "AquaSift_V0011.eep" || exit 0
	"C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-objdump.exe" -h -S "AquaSift_V0011.elf" > "AquaSift_V0011.lss"
	"C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-objcopy.exe" -O srec -R .eeprom -R .fuse -R .lock -R .signature -R .user_signatures "AquaSift_V0011.elf" "AquaSift_V0011.srec"
	"C:\Program Files (x86)\Atmel\Atmel Toolchain\AVR8 GCC\Native\3.4.1051\avr8-gnu-toolchain\bin\avr-size.exe" "AquaSift_V0011.elf"
	
	





# Other Targets
clean:
	-$(RM) $(OBJS_AS_ARGS) $(EXECUTABLES)  
	-$(RM) $(C_DEPS_AS_ARGS)   
	rm -rf "AquaSift_V0011.elf" "AquaSift_V0011.a" "AquaSift_V0011.hex" "AquaSift_V0011.lss" "AquaSift_V0011.eep" "AquaSift_V0011.map" "AquaSift_V0011.srec" "AquaSift_V0011.usersignatures"
	