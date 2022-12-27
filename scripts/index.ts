class KotlinToDart {
  kotlinArea: HTMLTextAreaElement
  dartArea: HTMLTextAreaElement
  parser: Parser
  constructor (kotlinArea: HTMLTextAreaElement, dartArea: HTMLTextAreaElement, parser: Parser) {
    this.kotlinArea = kotlinArea
    this.dartArea = dartArea
    this.parser = parser
    
    this.kotlinArea.value = `
      data class Member(
          val id: String? = null,
          var type: List<MemberType> = emptyList(),
          var email: String? = null,
          var phoneNumber: String? = null,
          var password: String? = null,
          val createdDate: LocalDateTime? = null,
          val modifyDateTime: LocalDateTime? = null
      )
    `

    this.handleChangeKotlinAreaValue(this.kotlinArea.value)

    this.kotlinArea.addEventListener('change', (event) => {
      
      // @ts-ignore
      this.handleChangeKotlinAreaValue(event.target.value as string)
      
    })
  }
  handleChangeKotlinAreaValue (text: string) {
    console.log(text)
    this.parser.parse(text)

    const dartTemplate = new DartClassTemplate(
      this.parser.className,
      this.parser.attributes
    )

    this.dartArea.value = dartTemplate.generate()
    
  }
}


class Parser {
  className: string
  attributes: Array<Array<string>>
  attributeStartIndex: number

  constructor() {
    this.className = ""
    this.attributes = []
    this.attributeStartIndex = 0
  }

  parse(text: string) {
    this.phase1(text)
  }

  phase1(text: string) {
    const regex = new RegExp("data class (\\w+)", "g")
    const result = regex.exec(text)
    
    console.log(regex.lastIndex, result)
    const [_, className] = result


    const otherText = text.slice(regex.lastIndex).trim()
    console.log(otherText)

    const attributeList = otherText.split('\n')
      .map(value => value.split(':'))
      .filter(value => value.length == 2)
      .map(([nameString, typeString]) => {
        const name = nameString.trim().split(" ")[1]
        const type = typeString.split("=")[0].trim().replace(',', '')
      
        return [name, type]
      })

    
    this.className = className
    this.attributes = attributeList
  }
}

const TypeMap = {
  'Byte': 'int',
  'Short': 'int',
  'Int': 'int',
  'Long': 'int',
  'Float': 'double',
  'Double': 'double',
  'Boolean': 'bool',
  'String': 'String',
  'Array': 'List',
  'LocalDateTime': 'DateTime',

  // FIXME: LocalDateTime과 겹쳐서 변환하기가 애매함
  // 'Date': 'DateTime',
}

class DartClassTemplate {

  className: string;
  attributeList: Array<Array<string>>;
  constructor(className: string, attributeList: Array<Array<string>>) {
    this.className = className;
    this.attributeList = attributeList;
  }

  generate(): string {

    return `
import 'package:json_annotation/json_annotation.dart';

part '${this.camelToSnake(this.className)}.g.dart';

@JsonSerializable()
class ${this.className} {
${this.generateAttributeText()}

${this.generateAttributeConstructor()}



\tfactory ${this.className}.fromJson(Map<String, dynamic> json) => _$${this.className}FromJson(json);

\tMap<String, dynamic> toJson() => _$${this.className}ToJson(this);
      
}`

  }

  private generateAttributeText() {
    return this.attributeList.reduce((prevText, [name, type]) => {
      return `\t${prevText}\n\t${this.typeConverter(type)} ${name};`
    }, "")
  }

  private generateAttributeConstructor() {
    const text = this.attributeList.map(([name, _]) => `\t\tthis.${name}`).join(',\n')

    return `\t${this.className}(\n${text}\n\t);`
  }

  private camelToSnake(name: string) {
    const snakeName = name.replace(/[A-Z]/g, (c) => {return '_' + c.toLowerCase()});
    return snakeName[0] === '_' ? snakeName.slice(1) : snakeName
  }

  private typeConverter(type: string) {
    let result = type
    for (let [ktType, dartType] of Object.entries(TypeMap)) {
      result = result.replace(ktType, dartType)
    }
    return result
  }

}



window.addEventListener('load', () => {
  const kotlinToDart = new KotlinToDart(
    document.getElementById('kotlin-area') as HTMLTextAreaElement,
    document.getElementById('dart-area') as HTMLTextAreaElement,
    new Parser()
  )
})