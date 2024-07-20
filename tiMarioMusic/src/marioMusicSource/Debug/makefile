################################################################################
# Automatically-generated file. Do not edit!
################################################################################

SHELL = cmd.exe

CG_TOOL_ROOT := C:/ti/ccsv5/tools/compiler/c5500_4.4.1

ORDERED_OBJS += \
$(GEN_CMDS__FLAG) \
"./C55xx_csl/src/csl_uart.obj" \
"./C55xx_csl/src/csl_spi.obj" \
"./C55xx_csl/src/csl_pll.obj" \
"./C55xx_csl/src/csl_i2s.obj" \
"./C55xx_csl/src/csl_i2c.obj" \
"./C55xx_csl/src/csl_gpio.obj" \
"./USBSTK_bsl/src/usbstk5505_spirom.obj" \
"./USBSTK_bsl/src/usbstk5505_led.obj" \
"./USBSTK_bsl/src/usbstk5505_i2s.obj" \
"./USBSTK_bsl/src/usbstk5505_i2c.obj" \
"./USBSTK_bsl/src/usbstk5505_gpio.obj" \
"./USBSTK_bsl/src/usbstk5505.obj" \
"./main.obj" \
"./initAIC3204.obj" \
"./LCD.obj" \
"../C5505.cmd" \
-l"libc.a" \

-include ../makefile.init

RM := DEL /F
RMDIR := RMDIR /S/Q

# All of the sources participating in the build are defined here
-include sources.mk
-include subdir_vars.mk
-include USBSTK_bsl/src/subdir_vars.mk
-include C55xx_csl/src/subdir_vars.mk
-include subdir_rules.mk
-include USBSTK_bsl/src/subdir_rules.mk
-include C55xx_csl/src/subdir_rules.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(S62_DEPS)),)
-include $(S62_DEPS)
endif
ifneq ($(strip $(C64_DEPS)),)
-include $(C64_DEPS)
endif
ifneq ($(strip $(ASM_DEPS)),)
-include $(ASM_DEPS)
endif
ifneq ($(strip $(CC_DEPS)),)
-include $(CC_DEPS)
endif
ifneq ($(strip $(S55_DEPS)),)
-include $(S55_DEPS)
endif
ifneq ($(strip $(C67_DEPS)),)
-include $(C67_DEPS)
endif
ifneq ($(strip $(C??_DEPS)),)
-include $(C??_DEPS)
endif
ifneq ($(strip $(CLA_DEPS)),)
-include $(CLA_DEPS)
endif
ifneq ($(strip $(CPP_DEPS)),)
-include $(CPP_DEPS)
endif
ifneq ($(strip $(S??_DEPS)),)
-include $(S??_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
ifneq ($(strip $(C62_DEPS)),)
-include $(C62_DEPS)
endif
ifneq ($(strip $(CXX_DEPS)),)
-include $(CXX_DEPS)
endif
ifneq ($(strip $(C++_DEPS)),)
-include $(C++_DEPS)
endif
ifneq ($(strip $(ASM_UPPER_DEPS)),)
-include $(ASM_UPPER_DEPS)
endif
ifneq ($(strip $(K_DEPS)),)
-include $(K_DEPS)
endif
ifneq ($(strip $(C43_DEPS)),)
-include $(C43_DEPS)
endif
ifneq ($(strip $(S67_DEPS)),)
-include $(S67_DEPS)
endif
ifneq ($(strip $(SA_DEPS)),)
-include $(SA_DEPS)
endif
ifneq ($(strip $(S43_DEPS)),)
-include $(S43_DEPS)
endif
ifneq ($(strip $(OPT_DEPS)),)
-include $(OPT_DEPS)
endif
ifneq ($(strip $(S64_DEPS)),)
-include $(S64_DEPS)
endif
ifneq ($(strip $(C_UPPER_DEPS)),)
-include $(C_UPPER_DEPS)
endif
ifneq ($(strip $(C55_DEPS)),)
-include $(C55_DEPS)
endif
endif

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 

# All Target
all: Midterm_Part_6.out

# Tool invocations
Midterm_Part_6.out: $(OBJS) $(CMD_SRCS) $(GEN_CMDS)
	@echo 'Building target: $@'
	@echo 'Invoking: C5500 Linker'
	"C:/ti/ccsv5/tools/compiler/c5500_4.4.1/bin/cl55" -v5515 --memory_model=large -g --define=c5505 --display_error_number --diag_warning=225 --ptrdiff_size=16 -z -m"Midterm_Part_6.map" --stack_size=0x200 --heap_size=0x400 -i"C:/ti/ccsv5/tools/compiler/c5500_4.4.1/lib" -i"C:/ti/ccsv5/tools/compiler/c5500_4.4.1/include" --reread_libs --display_error_number --warn_sections --xml_link_info="Midterm_Part_6_linkInfo.xml" --rom_model --sys_stacksize=0x200 -o "Midterm_Part_6.out" $(ORDERED_OBJS)
	@echo 'Finished building target: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) $(C5500_EXECUTABLE_OUTPUTS__QUOTED) "Midterm_Part_6.out"
	-$(RM) "LCD.pp" "initAIC3204.pp" "main.pp" "USBSTK_bsl\src\usbstk5505.pp" "USBSTK_bsl\src\usbstk5505_gpio.pp" "USBSTK_bsl\src\usbstk5505_i2c.pp" "USBSTK_bsl\src\usbstk5505_i2s.pp" "USBSTK_bsl\src\usbstk5505_led.pp" "USBSTK_bsl\src\usbstk5505_spirom.pp" "C55xx_csl\src\csl_gpio.pp" "C55xx_csl\src\csl_i2c.pp" "C55xx_csl\src\csl_i2s.pp" "C55xx_csl\src\csl_pll.pp" "C55xx_csl\src\csl_spi.pp" "C55xx_csl\src\csl_uart.pp" 
	-$(RM) "LCD.obj" "initAIC3204.obj" "main.obj" "USBSTK_bsl\src\usbstk5505.obj" "USBSTK_bsl\src\usbstk5505_gpio.obj" "USBSTK_bsl\src\usbstk5505_i2c.obj" "USBSTK_bsl\src\usbstk5505_i2s.obj" "USBSTK_bsl\src\usbstk5505_led.obj" "USBSTK_bsl\src\usbstk5505_spirom.obj" "C55xx_csl\src\csl_gpio.obj" "C55xx_csl\src\csl_i2c.obj" "C55xx_csl\src\csl_i2s.obj" "C55xx_csl\src\csl_pll.obj" "C55xx_csl\src\csl_spi.obj" "C55xx_csl\src\csl_uart.obj" 
	-@echo 'Finished clean'
	-@echo ' '

.PHONY: all clean dependents
.SECONDARY:

-include ../makefile.targets

