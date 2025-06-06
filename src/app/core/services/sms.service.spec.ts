import { of } from 'rxjs';
import { SmsService } from './sms.service';
import { TextBeltResponse } from '../models/TextBellResponse.model';

describe('SmsService', () => {
  let service: SmsService;
  let httpClient: { post: jasmine.Spy };
  let sms: any;
  let toastService: { showToastAsync: jasmine.Spy };
  let translationService: { instant: jasmine.Spy };

  beforeEach(() => {
    httpClient = {
      post: jasmine.createSpy('post')
    };
    sms = {};
    toastService = {
      showToastAsync: jasmine.createSpy('showToastAsync').and.returnValue(Promise.resolve())
    };
    translationService = {
      instant: jasmine.createSpy('instant').and.returnValue('translated')
    };

    service = new SmsService({} as any, sms, httpClient as any, toastService as any, translationService as any);
  });

  it('should return false and show toast when API responds with success false', async () => {
    const apiResponse: TextBeltResponse = { success: false, error: 'some error' };
    httpClient.post.and.returnValue(of(apiResponse));

    const result = await service.sendSmsViaTextBelt('1234567890', 'message');

    expect(result).toBeFalse();
    expect(toastService.showToastAsync).toHaveBeenCalled();
    expect(translationService.instant).toHaveBeenCalledWith('sms.errors.sendAPIsms');
  });
});
